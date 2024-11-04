import express from 'express';
import * as dotenv from 'dotenv';

const app = express();
dotenv.config();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server has started at at http://localhost:${PORT}`)
      console.log(process.env.ENVIRONMENT);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();