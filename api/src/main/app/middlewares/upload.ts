import multer from 'multer';
import path from 'node:path';
import { settings } from '@/main/app/config';

const UPLOADS_FOLDER = settings.application.uploadsFolderName;

export const upload = multer({
  storage: multer.diskStorage({
    destination(request, file, callback) {
      callback(
        null,
        path.resolve(__dirname, '..', '..', '..', '..', UPLOADS_FOLDER)
      );
    },
    filename(request, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});
