import express from 'express';
import cityRoutes from './cityRoutes.js';
import fuelStationRoutes from './fuelStationRoutes.js';
import priceRoutes from './priceRoutes.js';

const router = express.Router();

router.use(cityRoutes);
router.use(fuelStationRoutes);
router.use(priceRoutes);

export default router;