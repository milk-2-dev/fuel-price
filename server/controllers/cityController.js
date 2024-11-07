import City from '../mongodb/models/city.js';

export const getAllCities = async (req, res) => {
  try {
    const cities = await City.find({});

    res.status(200).json({success: true, data: cities});
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
}

export const createNewCity = async (req, res) => {
  try {
    const newCity = await City.create({
      ...req.body
    });

    res.status(201).json({success: true, data: newCity});
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: error});
  }
}