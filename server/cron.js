import cron from 'node-cron';
import * as dotenv from 'dotenv';

import FuelStation from './mongodb/models/fuelStation.js';
import Price from './mongodb/models/price.js';

dotenv.config();

const tolerance = 0.02; // Дозволена похибка для порівняння з плаваючою точкою

const isEqualZero = (newPrices) => {
  return newPrices.e10 === 0 && newPrices.super === 0 && newPrices.diesel === 0;
};

const calcTrend = (currentPrice, newPrice) => {
  if (Math.abs(newPrice - currentPrice) < tolerance) {
    return '';
  } else if (newPrice > currentPrice) {
    return 'up';
  } else {
    return 'down';
  }
};

export const fetchAndSavePrice = async () => {
  console.log('Cron is working...');
  try {
    const stationsList = await FuelStation.find({});

    const stationIds = stationsList.map(station => ({
      stationIdFromApi: station.stationIdFromApi,
      stationInternalId: station._id
    }));

    const EXTERNAL_API_URL = 'https://www.benzinpreis-aktuell.de/api.v2.php';

    const apiResults = await Promise.all(stationIds.map(async ({stationIdFromApi, stationInternalId}) => {
      const response = await fetch(`${EXTERNAL_API_URL}?station=${stationIdFromApi}`);
      const result = await response.json();

      result.e10 = parseFloat(result.e10);
      result.super = parseFloat(result.super);
      result.diesel = parseFloat(result.diesel);

      const currentPrices = await Price.findOne(
        {stationInternalId}
      ).sort({updatedAt: -1});

      if (!isEqualZero(result)) {
        return {
          stationInternalId,
          super: result.super,
          e10: result.e10,
          diesel: result.diesel,
          updatedAt: new Date().toISOString(),
          trend: {
            e10: calcTrend(currentPrices.e10, result.e10),
            super: calcTrend(currentPrices.super, result.super),
            diesel: calcTrend(currentPrices.diesel, result.diesel),
          }
        };
      } else {
        return null;
      }
    }));

    await Price.insertMany(apiResults.filter((item) => item !== null));
    console.log('Ціни на паливо успішно збережено в лог! ', new Date().toISOString());
    await removeDuplicateRecords();
  } catch (e) {
    console.error('Помилка при записі логів:', e);
  } finally {
    console.log('Cron is finished work');
  }
};

async function removeDuplicateRecords() {
  try {
    // Знаходимо всі записи, згруповані за унікальними значеннями
    const duplicates = await Price.aggregate([
      // Спочатку сортуємо записи за updatedAt (сучасніші записи будуть першими)
      {$sort: {updatedAt: 1}}, // Сортуємо по зростанню, щоб перший і останній були відповідно

      // Використовуємо $project для витягування лише дати (без часу) з updatedAt
      {
        $project: {
          stationInternalId: 1,
          e10: 1,
          super: 1,
          diesel: 1,
          updatedAtDate: {$dateToString: {format: '%Y-%m-%d', date: '$updatedAt'}},
        }
      },

      // Групуємо записи за унікальними полями та датою
      {
        $group: {
          _id: {
            stationInternalId: '$stationInternalId',
            e10: '$e10',
            super: '$super',
            diesel: '$diesel',
            updatedAtDate: '$updatedAtDate'
          },
          recordIds: {$push: '$_id'}, // Збираємо всі ідентифікатори записів у масив
          count: {$sum: 1}, // Рахуємо кількість дублікатів
        }
      },

      // Фільтруємо групи, де є більше одного запису
      {
        $match: {
          count: {$gt: 2}, // Більше одного, оскільки залишимо два записи (перший і останній)
          '_id.updatedAtDate': {$exists: true}
        }
      }
    ]);

    // Видалити всі записи, крім першого та останнього для кожної групи
    for (const duplicate of duplicates) {
      // Масив ідентифікаторів, з якого залишаємо лише перший і останній елементи
      const [ firstRecordId, ...middleRecordIds ] = duplicate.recordIds;
      const lastRecordId = middleRecordIds.pop(); // Забираємо останній запис

      // Видаляємо всі записи, крім першого і останнього
      await Price.deleteMany({
        _id: {$in: middleRecordIds}
      });

      console.log('Видалено дублікатів - ', middleRecordIds.length);
    }

    console.log('Duplicate records cleaned up successfully, retaining only the first and last record in each group.');
  } catch (error) {
    console.error('Error removing duplicate records:', error);
  }
};

if (process.env.ENV !== 'local') {
  cron.schedule('*/10 * * * *', fetchAndSavePrice);
}
