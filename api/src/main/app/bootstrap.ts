import mongoose from 'mongoose';
import { app } from '@/main/app/app';
import { settings } from './config';

const PORT = settings.application.port;

mongoose
  .connect('mongodb://localhost:27017/waiterapp')
  .then(() => {
    console.log('🍃 Connected to mongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on https://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
