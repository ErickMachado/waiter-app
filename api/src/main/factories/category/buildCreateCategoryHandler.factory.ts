import { MongoCategoriesRepository } from '@/external/repositories/mongo';
import { CreateCategoryHandler } from '@/presentation/handlers/category';
import { CreateCategoryUseCase } from '@/useCases/category';

export function buildCreateCategoriesHandler(): CreateCategoryHandler {
  const repository = new MongoCategoriesRepository();
  const useCase = new CreateCategoryUseCase(repository);
  const handler = new CreateCategoryHandler(useCase);

  return handler;
}
