import FuelStation from '../mongodb/models/fuelStation.js';

export const getAllCities = async (req, res) => {
  try {
    const cities = await City.find({});

    res.status(200).json({success: true, data: cities});
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
};

export const createNew = async (req, res) => {
  try {
    const {
      address,
      name,
      city,
      stationIdFromApi,
      location
    } = req.body;


    const newData = await FuelStation.create({
      address,
      name,
      city,
      stationIdFromApi,
      location
    });

    res.status(201).json({success: true, data: newData});
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: error});
  }
};