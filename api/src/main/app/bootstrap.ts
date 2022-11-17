import mongoose from 'mongoose';
import { app } from '@/main/app/app';

mongoose
  .connect('mongodb://localhost:27017/waiterapp')
  .then(() => {
    console.log('🍃 Connected to mongoDB');

    app.listen(3333, () => {
      console.log('🚀 Server running on https://localhost:3333');
    });
  })
  .catch((error) => {
    console.error(error);
  });
