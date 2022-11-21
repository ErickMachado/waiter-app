import {
  MongoCategoriesRepository,
  MongoProductsRepository,
} from '@/external/repositories/mongo';
import { ListProductsByCategoryHandler } from '@/presentation/handlers/category';
import { ListProductsByCategoryUseCase } from '@/useCases/category';

export function buildListProductsByCategory(): ListProductsByCategoryHandler {
  const categoriesRepository = new MongoCategoriesRepository();
  const productsRepository = new MongoProductsRepository();
  const useCase = new ListProductsByCategoryUseCase(
    categoriesRepository,
    productsRepository
  );

  return new ListProductsByCategoryHandler(useCase);
}
