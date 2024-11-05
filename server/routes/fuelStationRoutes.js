import express from 'express';

const router = express.Router();

import { createNew } from '../controllers/fuelStationController.js';

router.route('/fuel-station')
  .post(createNew);

export default router;