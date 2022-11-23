import { Item, Order } from '@/entities';
import { ProductsRepository } from '@/useCases/ports';
import { OrdersRepository } from '@/useCases/ports/ordersRepository';
import { UseCase } from '@/useCases/types/useCase';

export class ListOrdersUseCase implements UseCase<undefined, Order[]> {
  constructor(
    private readonly categoriesRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository
  ) {}

  public async execute(): Promise<Order[]> {
    const orders = await this.categoriesRepository.listAll();

    for (const order of orders) {
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
    }

    return orders;
  }
}
