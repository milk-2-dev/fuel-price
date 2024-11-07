import mongoose from "mongoose";

const Price = new mongoose.Schema({
  stationInternalId: {type: String, required: true},
  super: {type: String, required: true},
  e10: {type: String, required: true},
  diesel: {type: String, required: true},
  updatedAt: {type: Date, required: true}
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