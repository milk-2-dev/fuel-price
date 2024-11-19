import express from 'express';

const router = express.Router();

import { getPrices } from '../controllers/priceController.js';

router.route('/prices')
  .get(getPrices)

export default router;