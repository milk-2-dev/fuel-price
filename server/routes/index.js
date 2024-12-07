import express from 'express';
import cityRoutes from './cityRoutes.js';
import fuelStationRoutes from './fuelStationRoutes.js';
import priceRoutes from './priceRoutes.js';
import refreshRoutes from './refreshRoutes.js';

const router = express.Router();

router.use(cityRoutes);
router.use(fuelStationRoutes);
router.use(priceRoutes);
router.use(refreshRoutes);

export default router;