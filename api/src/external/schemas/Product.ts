import { model, Schema } from 'mongoose';

const productSchema = new Schema(
  {
    categoryId: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    id: {
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('category', {
  justOne: true,
  localField: 'categoryId',
  foreignField: 'id',
  ref: 'Category',
});

export const ProductSchema = model('Product', productSchema);
