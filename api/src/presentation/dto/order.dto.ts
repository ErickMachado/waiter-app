import { Order, Product } from '@/entities';

export class OrderDTO {
  public readonly id: string;
  public readonly table: string;
  public readonly items: { product: Product; quantity: number }[];
  public readonly createdAt: string;
  public readonly status: string;

  constructor(order: Order) {
    this.id = order.id;
    this.table = order.table;
    this.items = order.items.map((order) => ({
      product: order.product as Product,
      quantity: order.quantity,
    }));
    this.createdAt = order.createdAt;
    this.status = order.status;
  }
}
