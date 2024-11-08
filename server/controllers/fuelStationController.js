import FuelStation from '../mongodb/models/fuelStation.js';

export const getAllFuelStations = async (req, res) => {
  const {cityId, startDay, endDay} = req.query;

  try {
    let fuelStations = [];

    if (cityId) {
      fuelStations = await FuelStation.aggregate([
        {
          $match: {'city.id': cityId} // Фільтруємо станції за cityId
        },
        {
          $lookup: {
            from: 'prices',  // Назва колекції з цінами
            let: {stationId: {$toString: '$_id'}}, // Перетворюємо _id у рядок
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {$eq: ['$stationInternalId', '$$stationId']},
                      {$gte: ['$updatedAt', startDay]},
                      {$lte: ['$updatedAt', endDay]}
                    ]
                  }
                }
              },
              {$sort: {updatedAt: -1}} // Сортуємо за полем updatedAt (найновіші першими)
            ],
            as: 'prices'
          }
        },
        {
          $unwind: {
            path: '$prices',
            preserveNullAndEmptyArrays: true  // Залишає станції без цін, якщо вони є
          }
        },
        {
          $sort: {
            'prices.updatedAt': -1  // Сортуємо ціни за полем updatedAt у порядку спадання
          }
        },
        {
          $group: {
            _id: '$_id',
            name: {$first: '$name'},
            address: {$first: '$address'},
            city: {$first: '$city'},
            location: {$first: '$location'},
            stationIdFromApi: {$first: '$stationIdFromApi'},
            super: {$first: '$prices.super'},
            e10: {$first: '$prices.e10'},
            diesel: {$first: '$prices.diesel'},
            latestPriceUpdatedAt: {$first: '$prices.updatedAt'},
            trend: {$first: '$prices.trend'}
          }
        }
      ]);
    } else {
      fuelStations = await FuelStation.find();
    }

    res.status(200).json({success: true, data: fuelStations});
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
};

export const getFuelStation = async (req, res) => {
  const {id} = req.params;

  try {
    const fuelStation = await FuelStation.aggregate([
      {
        $match: {$expr: {$eq: [ {$toString: '$_id'}, id ]}} // Перетворюємо _id у рядок і порівнюємо з stationId
      },
      {
        $lookup: {
          from: 'prices',  // Назва колекції з цінами
          let: {stationId: {$toString: '$_id'}}, // Перетворюємо _id у рядок
          pipeline: [
            {$match: {$expr: {$eq: [ '$stationInternalId', '$$stationId' ]}}},
            {$sort: {updatedAt: -1}} // Сортуємо за полем updatedAt (найновіші першими)
          ],
          as: 'prices'
        }
      }
    ]).then(results => results[0]);

    res.status(200).json({success: true, data: fuelStation});
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