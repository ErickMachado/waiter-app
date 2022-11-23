import { Order } from '@/entities';

export interface OrdersRepository {
  findById(id: string): Promise<Order | undefined>;
  listAll(): Promise<Order[]>;
  save(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
}
