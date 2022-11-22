import { Order } from '@/entities';

export interface OrdersRepository {
  listAll(): Promise<Order[]>;
  save(order: Order): Promise<void>;
}
