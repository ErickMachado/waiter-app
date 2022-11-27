import { Order, Product } from '@/entities';
import { ProductDTO } from './product.dto';

export class OrderDTO {
  public readonly id: string;
  public readonly table: string;
  public readonly items: { product: Product; quantity: number }[];
  public readonly createdAt: string;
  public readonly status: string;

  constructor(order: Order) {
    this.id = order.id;
    this.table = order.table;
    this.items = order.items.map((order) => {
      const product = new ProductDTO(order.product as Product);

      return {
        product: product as unknown as Product,
        quantity: order.quantity,
      };
    });
    this.createdAt = order.createdAt;
    this.status = order.status;
  }
}
