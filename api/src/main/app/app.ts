import path from 'node:path';
import { router } from '@/main/app/routes';
import express from 'express';

const app = express();

app.use(express.json());
app.use(
  '/uploads',
  express.static(path.resolve(__dirname, '..', '..', '..', 'uploads'))
);
app.use(router);

export { app };
