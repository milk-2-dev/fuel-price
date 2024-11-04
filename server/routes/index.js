import express from 'express';
import cityRoutes from './cityRoutes.js';

const router = express.Router();

router.use(cityRoutes);

export default router;