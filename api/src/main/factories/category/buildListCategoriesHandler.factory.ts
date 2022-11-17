import { MongoCategoriesRepository } from '@/external/repositories/mongo';
import { ListCategoriesHandler } from '@/presentation/handlers/category/listCategories';
import { ListCategoriesUseCase } from '@/useCases/category';

export function buildListCategoriesHandler() {
  const repository = new MongoCategoriesRepository();
  const useCase = new ListCategoriesUseCase(repository);

  return new ListCategoriesHandler(useCase);
}
