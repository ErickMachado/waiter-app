import { Request, Response } from 'express';
import { Order } from '../../models/Order';

export async function cancelOrder(request: Request, response: Response) {
  try {
    const { orderId } = request.params;

    await Order.findByIdAndDelete(orderId);

    return response.sendStatus(204);
  } catch (error) {
    console.error(error);

    return response.sendStatus(500);
  }
}
