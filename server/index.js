import express from 'express';
import * as dotenv from 'dotenv';

import connectDB from './mongodb/connect.js';


const app = express();
dotenv.config();

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL).catch(console.dir);
    app.listen(PORT, () => {
      console.log(`Server has started at at http://localhost:${PORT}`)
      console.log(process.env.ENVIRONMENT);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();