import mongoose from 'mongoose';
import { app } from '@/main/app/app';
import { getConnectionString, settings } from './config';

const PORT = settings.application.port;

mongoose
  .connect(getConnectionString())
  .then(() => {
    console.log('🍃 Connected to mongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on https://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
