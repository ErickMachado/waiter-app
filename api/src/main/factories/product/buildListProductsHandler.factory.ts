import { MongoProductsRepository } from '@/external/repositories/mongo';
import { ListProductsHandler } from '@/presentation/handlers/product';
import { ListProductsUseCase } from '@/useCases/product';

export function buildListProductsHandler() {
  const repository = new MongoProductsRepository();
  const useCase = new ListProductsUseCase(repository);

  return new ListProductsHandler(useCase);
}
