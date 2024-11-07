import mongoose from "mongoose";

const Price = new mongoose.Schema({
  stationInternalId: {type: String, required: true},
  e10: {type: Number, required: true},
  super: {type: Number, required: true},
  diesel: {type: Number, required: true},
  updatedAt: {type: Date, required: true},
  trend: {
    e10: {type: String},
    super: {type: String},
    diesel: {type: String},
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

const PriceSchema = mongoose.model('prices', Price);

export default PriceSchema;