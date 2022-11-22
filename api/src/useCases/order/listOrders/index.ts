import { Order } from '@/entities';
import { OrdersRepository } from '@/useCases/ports/ordersRepository';
import { UseCase } from '@/useCases/types/useCase';

export class ListOrdersUseCase implements UseCase<undefined, Order[]> {
  constructor(private readonly repository: OrdersRepository) {}

  public async execute(): Promise<Order[]> {
    const orders = await this.repository.listAll();

    return orders;
  }
}
