import { MongoOrdersRepository } from '@/external/repositories/mongo/orders';
import { ListOrdersHandler } from '@/presentation/handlers/order';
import { ListOrdersUseCase } from '@/useCases/order';

export function buildListOrdersHandler(): ListOrdersHandler {
  const repository = new MongoOrdersRepository();
  const useCase = new ListOrdersUseCase(repository);

  return new ListOrdersHandler(useCase);
}
