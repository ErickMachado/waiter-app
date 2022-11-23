import { model, Schema } from 'mongoose';

const orderSchema = new Schema({
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
  id: {
    required: true,
    type: String,
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
});

export const OrderSchema = model('Order', orderSchema);
