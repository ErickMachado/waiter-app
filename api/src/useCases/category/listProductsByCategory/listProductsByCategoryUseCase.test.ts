import { InMemoryCategoriesRepository } from '@tests/mocks/category.repository';
import { InMemoryProductsRepository } from '@tests/mocks/product.repository';
import { ListProductsByCategoryUseCase } from '@/useCases/category';
import { faker } from '@faker-js/faker';
import { left } from '@/shared';
import { CategoryNotFoundError } from '@/useCases/errors';

const makeSut = () => {
  const categoriesRepository = new InMemoryCategoriesRepository();
  const productsRepository = new InMemoryProductsRepository();
  const sut = new ListProductsByCategoryUseCase(
    categoriesRepository,
    productsRepository
  );

  return { categoriesRepository, productsRepository, sut };
};

describe('List products by category use case', () => {
  it('Should return a category not found error when category does not exists', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const response = await sut.execute(faker.datatype.uuid());

    // Assert
    expect(response).toEqual(left(new CategoryNotFoundError()));
  });

  it('Should return categories that match with provided category id', async () => {
    // Arrange
    const { categoriesRepository, productsRepository, sut } = makeSut();

    const category = categoriesRepository.populate();

    productsRepository.populate(category.id);
    productsRepository.populate();

    // Act
    const response = await sut.execute(category.id);

    // Assert
    expect(response.isRight() && response.value.length).toBe(1);
  });
});
