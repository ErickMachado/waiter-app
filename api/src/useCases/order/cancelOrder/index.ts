import { Either, left, right } from '@/shared';
import { OrderNotFoundError } from '@/useCases/errors';
import { OrdersRepository } from '@/useCases/ports/ordersRepository';
import { UseCase } from '@/useCases/types/useCase';

export class CancelOrderUseCase
  implements UseCase<string, Either<OrderNotFoundError, string>>
{
  constructor(private readonly repository: OrdersRepository) {}

  public async execute(
    orderId: string
  ): Promise<Either<OrderNotFoundError, string>> {
    const order = await this.repository.findById(orderId);

    if (!order) return left(new OrderNotFoundError());

    await this.repository.delete(orderId);

    return right(orderId);
  }
}
