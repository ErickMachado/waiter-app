import { Item, Order, Status } from '@/entities';
import { Either, left, right } from '@/shared';
import { InvalidOrderStatusError, OrderNotFoundError } from '@/useCases/errors';
import { ProductsRepository } from '@/useCases/ports';
import { OrdersRepository } from '@/useCases/ports/ordersRepository';
import { UseCase } from '@/useCases/types/useCase';

export interface ChangeOrderStatusPayload {
  orderId: string;
  status: string;
}

export class ChangeOrderStatusUseCase
  implements
    UseCase<
      ChangeOrderStatusPayload,
      Either<OrderNotFoundError | InvalidOrderStatusError, Order>
    >
{
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository
  ) {}

  public async execute({
    orderId,
    status,
  }: ChangeOrderStatusPayload): Promise<
    Either<OrderNotFoundError | InvalidOrderStatusError, Order>
  > {
    if (!Object.values(Status).includes(status as Status))
      return left(new InvalidOrderStatusError());

    const order = await this.ordersRepository.findById(orderId);

    if (!order) return left(new OrderNotFoundError());

    const items: Item[] = [];

    for (const item of order.items) {
      const product = await this.productsRepository.findById(item.productId);

      items.push({
        productId: item.productId,
        product: product,
        quantity: item.quantity,
      });
    }

    order.items = items;

    const newStatus = Object.values(Status).find(
      (value) => value === status
    ) as Status;

    order.updateStatus(newStatus);

    await this.ordersRepository.update(order);

    return right(order);
  }
}
