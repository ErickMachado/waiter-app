import { Request, Response } from 'express';
import { Order } from '../../models/Order';

export async function createOrder(request: Request, response: Response) {
  try {
    const { products, table } = request.body;
    const order = await Order.create({ products, table });

    return response.status(201).json(order);
  } catch {
    return response.sendStatus(500);
  }
}
