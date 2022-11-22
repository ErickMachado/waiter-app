import { MongoProductsRepository } from '@/external/repositories/mongo';
import { MongoOrdersRepository } from '@/external/repositories/mongo/orders';
import { CreateOrderHandler } from '@/presentation/handlers/order';
import { CreateOrderUseCase } from '@/useCases/order';

export function buildCreateOrderHandler(): CreateOrderHandler {
  const productsRepository = new MongoProductsRepository();
  const ordersRepository = new MongoOrdersRepository();
  const useCase = new CreateOrderUseCase(productsRepository, ordersRepository);

  return new CreateOrderHandler(useCase);
}
