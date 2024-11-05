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
})

const FuelStationSchema = mongoose.model('fuel_stations', FuelStation);

export default FuelStationSchema;