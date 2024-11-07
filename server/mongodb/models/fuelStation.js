import mongoose from "mongoose";

const FuelStation = new mongoose.Schema({
  address: {type: String, required: true},
  name: {type: String, required: true},
  city: {
    id: {type: String, required: true},
    name: {type: String, required: true},
  },
  stationIdFromApi: {type: String, required: true},
  location: {
    longitude: {type: Number, required: true},
    latitude: {type: Number, required: true},
    plusCode: {type: String}
  }
},{
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id; // Дублюємо _id у поле id
      delete ret._id; // Видаляємо поле _id return ret;
    }
  }
})

const FuelStationSchema = mongoose.model('fuel_stations', FuelStation);

export default FuelStationSchema;