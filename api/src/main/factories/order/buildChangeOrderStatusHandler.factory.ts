import { MongoProductsRepository } from '@/external/repositories/mongo';
import { MongoOrdersRepository } from '@/external/repositories/mongo/orders';
import { ChangeOrderStatusHandler } from '@/presentation/handlers/order';
import { ChangeOrderStatusUseCase } from '@/useCases/order';

export function buildChangeOrderStatusHandler() {
  const ordersRepository = new MongoOrdersRepository();
  const productsRepository = new MongoProductsRepository();
  const useCase = new ChangeOrderStatusUseCase(
    ordersRepository,
    productsRepository
  );

  return new ChangeOrderStatusHandler(useCase);
}
