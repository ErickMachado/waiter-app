import { Item, Order, OrderData } from '@/entities';
import { Either, left, right } from '@/shared';
import { ProductNotFoundError } from '@/useCases/errors';
import { ProductsRepository } from '@/useCases/ports';
import { OrdersRepository } from '@/useCases/ports/ordersRepository';
import { UseCase } from '@/useCases/types/useCase';

export class CreateOrderUseCase
  implements UseCase<OrderData, Either<ProductNotFoundError, Order>>
{
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly ordersRepository: OrdersRepository
  ) {}

  public async execute(
    payload: OrderData
  ): Promise<Either<ProductNotFoundError, Order>> {
    for (const item of payload.items) {
      const exists = await this.productsRepository.exists(item.productId);

      if (!exists) return left(new ProductNotFoundError());
    }

    const items: Item[] = [];

    for (const item of payload.items) {
      const product = await this.productsRepository.findById(item.productId);

      items.push({
        productId: item.productId,
        product: product,
        quantity: item.quantity,
      });
    }

    const order = Order.create({ ...payload, items });

    if (order.isLeft()) return left(order.value);

    await this.ordersRepository.save(order.value);

    return right(order.value);
  }
}
