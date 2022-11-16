import { CategoriesRepository } from '@/useCases/ports';
import { Category, CategoryData } from '@/entities';
import {
  InvalidNameError,
  InvalidIconError,
  InvalidIconLengthError,
} from '@/entities/errors';
import { Either, left, right } from '@/shared';
import { CategoryConflictError } from '@/useCases/errors';

type CreateCategoryResponse = Either<
  | CategoryConflictError
  | InvalidIconError
  | InvalidIconLengthError
  | InvalidNameError,
  Category
>;

export class CreateCategoryUseCase {
  constructor(private readonly repository: CategoriesRepository) {}

  public async execute(payload: CategoryData): Promise<CreateCategoryResponse> {
    const isCategoryAlreadyRegistered = await this.repository.exists(
      payload.name
    );

    if (isCategoryAlreadyRegistered) {
      return left(new CategoryConflictError(payload.name));
    }

    const category = Category.create(payload);

    if (category.isLeft()) return left(category.value);

    await this.repository.save(category.value);

    return right(category.value);
  }
}
