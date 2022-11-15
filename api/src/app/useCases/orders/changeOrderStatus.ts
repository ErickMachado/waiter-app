import { Request, Response } from 'express';
import { Order } from '../../models/Order';

export async function changeOrderStatus(request: Request, response: Response) {
  try {
    const { orderId } = request.params;
    const { status } = request.body;

    if (!['WAITING', 'IN_PRODUCTION', 'DONE'].includes(status)) {
      return response.status(400).json({
        error: 'Invalid status',
      });
    }

    await Order.findByIdAndUpdate(orderId, { status });

    return response.sendStatus(204);
  } catch (error) {
    console.error(error);

    return response.sendStatus(500);
  }
}
