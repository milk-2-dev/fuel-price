import express from 'express';

const router = express.Router();

import { getAllCities, createNewCity } from '../controllers/cityController.js';

router.route('/cities')
  .get(getAllCities)
  .post(createNewCity);

export default router;