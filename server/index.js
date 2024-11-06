import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

import connectDB from './mongodb/connect.js';
import routes from './routes/index.js';
import './cron.js';

dotenv.config();

const app = express();
app.use(cors()); // to allow cross origin requests
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

const PORT = 3000;

app.use('/api/v1/', routes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL).catch(console.dir);
    app.listen(PORT, () => {
      console.log(`Server has started at at http://localhost:${PORT}`);
      console.log(process.env.ENVIRONMENT);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();