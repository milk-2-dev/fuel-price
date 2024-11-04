import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const clientOptions = {
  serverApi: {version: '1', strict: true, deprecationErrors: true},
  dbName: process.env.DB_NAME
};

const connectDB = async (url) => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(url, clientOptions);
    await mongoose.connection.db.admin().command({ping: 1});
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (e) {
    console.log('Error in connection to MongoDB!');
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
};

export default connectDB;