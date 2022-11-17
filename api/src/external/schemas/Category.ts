import { model, Schema } from 'mongoose';

export const CategorySchema = model(
  'Category',
  new Schema({
    id: {
      required: true,
      type: String,
    },
    icon: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
  })
);
