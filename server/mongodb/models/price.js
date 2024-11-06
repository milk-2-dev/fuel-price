import mongoose from "mongoose";

const Price = new mongoose.Schema({
  stationInternalId: {type: String, required: true},
  super: {type: String, required: true},
  e10: {type: String, required: true},
  diesel: {type: String, required: true},
  updatedAt: {type: Date, required: true}
})

const PriceSchema = mongoose.model('prices', Price);

export default PriceSchema;