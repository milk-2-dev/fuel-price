import cron from 'node-cron';

import FuelStation from './mongodb/models/fuelStation.js';
import Price from './mongodb/models/price.js';

const tolerance = 0.02; // Дозволена похибка для порівняння з плаваючою точкою

const isPricesChanged = (currentPrices, newPrices) => {
  const isEqualE10 = currentPrices.e10 === newPrices.e10;
  const isEqualSuper = currentPrices.super === newPrices.super;
  const isEqualDiesel = currentPrices.diesel === newPrices.diesel;

  return !isEqualE10 || !isEqualSuper || !isEqualDiesel;
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
      ).sort({ updatedAt: -1 });

      console.log('currentPrices - ', currentPrices);
      console.log('newPrices - ', result);


      if (isPricesChanged(currentPrices, result)) {
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

    console.log(apiResults);

    await Price.insertMany(apiResults.filter((item) => item !== null));
    console.log('Ціни на паливо успішно збережено в лог! ', new Date().toISOString());
  } catch (e) {
    console.error('Помилка при записі логів:', e);
  } finally {
    console.log('Cron is finished work');
  }
};

// (async function(){
//   await Price.updateMany(
//     {
//       e10: { $type: "string" },
//       super: { $type: "string" },
//       diesel: { $type: "string" }
//     },
//     [
//       {
//         $set: {
//           e10: { $toDouble: "$e10" },
//           super: { $toDouble: "$super" },
//           diesel: { $toDouble: "$diesel" }
//         }
//       }
//     ]
//   );
// })();

// async function removeDuplicateRecords() {
//   try {
//     // Знайти всі записи, згруповані за унікальними значеннями `stationInternalId`, `e10`, `super`, `diesel`
//     const duplicates = await Price.aggregate([
//       // Спочатку сортуємо записи за updatedAt (сучасніші записи будуть першими)
//       { $sort: { updatedAt: -1 } },
//
//       // Використовуємо $project для витягування лише дати (без часу) з updatedAt
//       {
//         $project: {
//           stationInternalId: 1,
//           e10: 1,
//           super: 1,
//           diesel: 1,
//           updatedAtDate: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }, // Форматуємо дату
//         }
//       },
//
//       // Групуємо записи за унікальними полями та датою
//       {
//         $group: {
//           _id: {
//             stationInternalId: "$stationInternalId",
//             e10: "$e10",
//             super: "$super",
//             diesel: "$diesel",
//             updatedAtDate: "$updatedAtDate" // Включаємо дату без часу
//           },
//           latestRecordId: { $first: "$_id" }, // Залишаємо ID першого запису
//           count: { $sum: 1 }, // Рахуємо кількість дублікатів
//         }
//       },
//
//       // Фільтруємо групи, де є більше одного запису та всі записи належать до одного дня
//       {
//         $match: {
//           count: { $gt: 1 },
//           "_id.updatedAtDate": { $exists: true } // Перевіряємо, чи всі записи мають однакову дату
//         }
//       }
//     ]);
//
//     // console.log(duplicates);
//
//     // Видалити всі записи, крім останнього для кожної групи
//     for (const duplicate of duplicates) {
//       await Price.deleteMany({
//         _id: { $ne: duplicate.latestRecordId },
//         stationInternalId: duplicate._id.stationInternalId,
//         e10: duplicate._id.e10,
//         super: duplicate._id.super,
//         diesel: duplicate._id.diesel,
//         updatedAt: { $gte: new Date(duplicate._id.updatedAtDate) } // Перевіряємо, що вони належать до одного дня
//       });
//     }
//
//     console.log("Duplicate records cleaned up successfully.");
//   } catch (error) {
//     console.error("Error removing duplicate records:", error);
//   }
// }

// removeDuplicateRecords()

cron.schedule('*/10 * * * *', fetchAndSavePrice);