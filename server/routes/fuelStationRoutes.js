import express from 'express';

const router = express.Router();

import { createNew, getAllFuelStations, getFuelStation } from '../controllers/fuelStationController.js';

router.route('/fuel-station')
  .get(getAllFuelStations)
  .post(createNew);

router.route('/fuel-station/:id')
  .get(getFuelStation)

export default router;