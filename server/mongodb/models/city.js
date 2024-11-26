import mongoose from 'mongoose';

const City = new mongoose.Schema({
  name: {type: String, required: true},
  postCode: {type: Number, required: true},
  location: {
    longitude: {type: Number, required: true},
    latitude: {type: Number, required: true},
    plusCode: {type: String}
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

const CitySchema = mongoose.model('Cities', City);

export default CitySchema;