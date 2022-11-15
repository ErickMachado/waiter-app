import { Request, Response } from 'express';
import { Order } from '../../models/Order';

export async function listOrders(request: Request, response: Response) {
  try {
    const products = await Order.find()
      .sort({ createdAt: 1 })
      .populate('products.product');

    return response.status(200).json(products);
  } catch (error) {
    console.error(error);

    return response.sendStatus(500);
  }
}
