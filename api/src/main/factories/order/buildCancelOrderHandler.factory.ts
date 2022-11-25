import { MongoOrdersRepository } from '@/external/repositories/mongo/orders';
import { CancelOrderHandler } from '@/presentation/handlers/order';
import { CancelOrderUseCase } from '@/useCases/order';

export function buildCancelOrderHandler() {
  const repository = new MongoOrdersRepository();
  const useCase = new CancelOrderUseCase(repository);

  return new CancelOrderHandler(useCase);
}
