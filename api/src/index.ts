import express from 'express';
import mongoose from 'mongoose';
import { router } from './router';
import path from 'node:path';

const app = express();

mongoose.connect('mongodb://localhost:27017').then(() => {
  console.log('🍃 Connected to mongoDB');

  app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
  app.use(express.json());
  app.use(router);

  const port = 3001;
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
});
