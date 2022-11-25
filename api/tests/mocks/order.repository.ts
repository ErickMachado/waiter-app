import { Order } from '@/entities';
import { OrdersRepository } from '@/useCases/ports/ordersRepository';
import { mockOrderData } from '@tests/mocks';
import cuid from 'cuid';

export class InMemoryOrdersRepository implements OrdersRepository {
  private readonly database = new Map<string, Order>();

  public async listAll(): Promise<Order[]> {
    return [...this.database.values()];
  }

  public async save(order: Order): Promise<void> {
    this.database.set(order.id, order);
  }

  public populate(productId?: string): Order {
    const order = Order.create(
      mockOrderData({ productId: productId ?? cuid() })
    );

    if (order.isLeft()) {
      throw new Error('Order is not valid');
    }

    this.database.set(order.value.id, order.value);

    return order.value;
  }

  public async findById(id: string): Promise<Order | undefined> {
    return this.database.get(id);
  }

  public async update(order: Order): Promise<void> {
    this.database.set(order.id, order);
  }

  public async delete(orderId: string): Promise<void> {
    this.database.delete(orderId);
  }
}
