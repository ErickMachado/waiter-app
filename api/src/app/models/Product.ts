import { model, Schema } from 'mongoose';

export const Product = model(
  'Product',
  new Schema({
    category: {
      ref: 'Category',
      required: true,
      type: Schema.Types.ObjectId,
    },
    description: {
      required: true,
      type: String,
    },
    ingredients: {
      required: true,
      type: [{ icon: String, name: String }],
    },
    imagePath: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    price: {
      required: true,
      type: String,
    },
  })
);
