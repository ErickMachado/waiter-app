import { model, Schema } from 'mongoose';

const orderSchema = new Schema(
  {
    createdAt: {
      required: true,
      type: String,
    },
    items: {
      required: true,
      type: [
        {
          productId: {
            required: true,
            type: String,
          },
          quantity: {
            default: 1,
            type: Number,
          },
        },
      ],
    },
    status: {
      enum: ['Waiting', 'InProduction', 'Done'],
      required: true,
      type: String,
    },
    table: {
      required: true,
      type: String,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.virtual('items.product', {
  ref: 'Product',
  localField: 'items.productId',
  foreignField: 'id',
});

export const OrderSchema = model('Order', orderSchema);
