import { model, Schema } from 'mongoose';

export const Order = model(
  'Order',
  new Schema({
    createdAt: {
      default: Date.now,
      type: Date,
    },
    products: {
      required: true,
      type: [
        {
          product: {
            ref: 'Product',
            required: true,
            type: Schema.Types.ObjectId,
          },
          quantity: {
            default: 1,
            type: Number,
          },
        },
      ],
    },
    status: {
      default: 'WAITING',
      enum: ['WAITING', 'IN_PRODUCTION', 'DONE'],
      required: true,
      type: String,
    },
    table: {
      required: true,
      type: String,
    },
  })
);
