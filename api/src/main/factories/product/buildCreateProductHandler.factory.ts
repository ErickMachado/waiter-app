import {
  MongoCategoriesRepository,
  MongoProductsRepository,
} from '@/external/repositories/mongo';
import { CreateProductHandler } from '@/presentation/handlers/product';
import { CreateProductUseCase } from '@/useCases/product';

export function buildCreateProductHandler(): CreateProductHandler {
  const productsRepository = new MongoProductsRepository();
  const categoriesRepository = new MongoCategoriesRepository();
  const useCase = new CreateProductUseCase(
    categoriesRepository,
    productsRepository
  );

  return new CreateProductHandler(useCase);
}
