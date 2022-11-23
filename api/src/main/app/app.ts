import path from 'node:path';
import { router } from '@/main/app/routes';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  '/uploads',
  express.static(path.resolve(__dirname, '..', '..', '..', 'uploads'))
);
app.use(router);

export { app };
