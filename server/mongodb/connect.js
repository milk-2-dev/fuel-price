import mongoose from 'mongoose';

const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

const connectDB = async (url) => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(url, clientOptions);
    await mongoose.connection.db.admin().command({ping: 1});
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (e) {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
};

export default connectDB;