import { Order } from '@/entities';
import { OrdersRepository } from '@/useCases/ports/ordersRepository';

export class InMemoryOrdersRepository implements OrdersRepository {
  private readonly database = new Map<string, Order>();

  public async listAll(): Promise<Order[]> {
    return [...this.database.values()];
  }

  public async save(order: Order): Promise<void> {
    this.database.set(order.id, order);
  }
}
