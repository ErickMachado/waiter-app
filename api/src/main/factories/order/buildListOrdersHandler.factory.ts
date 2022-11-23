import { MongoProductsRepository } from '@/external/repositories/mongo';
import { MongoOrdersRepository } from '@/external/repositories/mongo/orders';
import { ListOrdersHandler } from '@/presentation/handlers/order';
import { ListOrdersUseCase } from '@/useCases/order';

export function buildListOrdersHandler(): ListOrdersHandler {
  const categoriesRepository = new MongoOrdersRepository();
  const productsRepository = new MongoProductsRepository();
  const useCase = new ListOrdersUseCase(
    categoriesRepository,
    productsRepository
  );

  return new ListOrdersHandler(useCase);
}
