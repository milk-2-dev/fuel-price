import mongoose from 'mongoose';

const FuelStation = new mongoose.Schema({
  address: {type: String, required: true},
  name: {type: String, required: true},
  city: {
    id: {type: String, required: true},
    name: {type: String, required: true},
  },
  stationIdFromApi: {type: String, required: true},
  location: {
    type: {
      type: String,
      enum: [ 'Point' ],
      required: true
    },
    coordinates: {
      type: [ Number ], // [довгота, широта]
      required: true
    }
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id; // Дублюємо _id у поле id
      delete ret._id; // Видаляємо поле _id return ret;
    }
  }
});

// Створюємо геопросторовий індекс для поля location
FuelStation.index({ location: "2dsphere" });

const FuelStationSchema = mongoose.model('fuel_stations', FuelStation);

export default FuelStationSchema;