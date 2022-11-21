import { Product } from '@/entities';
import { Either, left, right } from '@/shared';
import { CategoryNotFoundError } from '@/useCases/errors';
import { CategoriesRepository, ProductsRepository } from '@/useCases/ports';
import { UseCase } from '@/useCases/types/useCase';

export class ListProductsByCategoryUseCase
  implements UseCase<string, Either<CategoryNotFoundError, Product[]>>
{
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly productsRepository: ProductsRepository
  ) {}

  public async execute(
    categoryId: string
  ): Promise<Either<CategoryNotFoundError, Product[]>> {
    const category = await this.categoriesRepository.findById(categoryId);

    if (!category) return left(new CategoryNotFoundError());

    const products = await this.productsRepository.listAllByCategoryId(
      categoryId
    );

    return right(products);
  }
}
