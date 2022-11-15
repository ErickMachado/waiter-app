import { model, Schema } from 'mongoose';

export const Category = model(
  'Category',
  new Schema({
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
