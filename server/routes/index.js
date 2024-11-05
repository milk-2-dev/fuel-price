import express from 'express';
import cityRoutes from './cityRoutes.js';
import fuelStationRoutes from './fuelStationRoutes.js';

const router = express.Router();

router.use(cityRoutes);
router.use(fuelStationRoutes);

export default router;