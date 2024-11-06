import cron from 'node-cron';

import FuelStation from './mongodb/models/fuelStation.js';
import Price from './mongodb/models/price.js';

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

      return {
        stationInternalId,
        super: result.super,
        e10: result.e10,
        diesel: result.diesel,
        updatedAt: new Date().toISOString(),
      };
    }));

    await Price.insertMany(apiResults);
    console.log('Ціни на паливо успішно збережено в лог! ', new Date().toISOString());
  } catch (e) {
    console.error('Помилка при записі логів:', e);
  } finally {
    console.log('Cron is finished work');
  }
};

cron.schedule('*/10 * * * *', fetchAndSavePrice);