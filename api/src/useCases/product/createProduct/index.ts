import { Product, ProductData } from '@/entities';
import {
  EmptyDescriptionError,
  InvalidDescriptionLengthError,
  InvalidIconError,
  InvalidIconLengthError,
  InvalidNameError,
} from '@/entities/errors';
import { Either, left, right } from '@/shared';
import { CategoryNotFoundError } from '@/useCases/errors';
import { CategoriesRepository, ProductsRepository } from '@/useCases/ports';
import { UseCase } from '@/useCases/types/useCase';

export type CreateProductResponse = Either<
  | InvalidDescriptionLengthError
  | InvalidIconError
  | InvalidIconLengthError
  | InvalidNameError
  | EmptyDescriptionError,
  Product
>;

export class CreateProductUseCase
  implements UseCase<ProductData, CreateProductResponse>
{
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly productsRepository: ProductsRepository
  ) {}

  public async execute(payload: ProductData): Promise<CreateProductResponse> {
    const category = await this.categoriesRepository.findById(
      payload.categoryId
    );

    if (!category) return left(new CategoryNotFoundError());

    const product = Product.create(payload);

    if (product.isLeft()) return left(product.value);

    await this.productsRepository.save(product.value);

    return right(product.value);
  }
}
