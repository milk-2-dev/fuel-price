import mongoose from "mongoose";

const City = new mongoose.Schema({
  name: {type: String, required: true},
  postCode: {type: Number, required: true}
})

const CitySchema = mongoose.model('Cities', City);

export default CitySchema;