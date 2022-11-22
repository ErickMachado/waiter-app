import { Order } from '@/entities';
import { OrdersRepository } from '@/useCases/ports/ordersRepository';
import { mockOrderData } from '@tests/mocks';

export class InMemoryOrdersRepository implements OrdersRepository {
  private readonly database = new Map<string, Order>();

  public async listAll(): Promise<Order[]> {
    return [...this.database.values()];
  }

  public async save(order: Order): Promise<void> {
    this.database.set(order.id, order);
  }

  public populate(): Order {
    const order = Order.create(mockOrderData());

    if (order.isLeft()) {
      throw new Error('Order is not valid');
    }

    this.database.set(order.value.id, order.value);

    return order.value;
  }
}
