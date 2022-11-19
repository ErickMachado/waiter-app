import { Product } from '@/entities';
import {
  EmptyDescriptionError,
  InvalidDescriptionLengthError,
  InvalidIconError,
  InvalidIconLengthError,
  InvalidNameError,
} from '@/entities/errors';
import { left } from '@/shared';
import { CategoryNotFoundError } from '@/useCases/errors';
import { CreateProductUseCase } from '@/useCases/product';
import { faker } from '@faker-js/faker';
import { mockProductData } from '@tests/mocks';
import { InMemoryCategoriesRepository } from '@tests/mocks/category.repository';
import { InMemoryProductsRepository } from '@tests/mocks/product.repository';

const makeSut = () => {
  const categoriesRepository = new InMemoryCategoriesRepository();
  const productsRepository = new InMemoryProductsRepository();
  const sut = new CreateProductUseCase(
    categoriesRepository,
    productsRepository
  );

  return { categoriesRepository, productsRepository, sut };
};

describe('Create product use case', () => {
  it('Should return error when category does not exists', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const response = await sut.execute(mockProductData());

    // Assert
    expect(response).toEqual(left(new CategoryNotFoundError()));
  });

  it('Should return an error when ingredient icon contains letters', async () => {
    // Arrange
    const { categoriesRepository, sut } = makeSut();
    const category = categoriesRepository.populate();
    const payload = mockProductData({
      categoryId: category.id,
      ingredientIcon: faker.lorem.word(),
    });

    // Act
    const response = await sut.execute(payload);

    // Assert
    expect(response).toEqual(left(new InvalidIconError()));
  });

  it('Should return an error when ingredient icon contains more than a single emoji', async () => {
    // Arrange
    const { categoriesRepository, sut } = makeSut();
    const category = categoriesRepository.populate();
    const icon = '🧀🍕';
    const payload = mockProductData({
      categoryId: category.id,
      ingredientIcon: icon,
    });

    // Act
    const response = await sut.execute(payload);

    // Assert
    expect(response).toEqual(left(new InvalidIconLengthError(icon)));
  });

  it('Should return an error when ingredient name is empty', async () => {
    // Arrange
    const { categoriesRepository, sut } = makeSut();
    const category = categoriesRepository.populate();
    const payload = mockProductData({
      categoryId: category.id,
      ingredientName: '',
    });

    // Act
    const response = await sut.execute(payload);

    // Assert
    expect(response).toEqual(left(new InvalidNameError('')));
  });

  it('Should return an error when name is empty', async () => {
    // Arrange
    const { categoriesRepository, sut } = makeSut();
    const category = categoriesRepository.populate();
    const payload = mockProductData({
      categoryId: category.id,
      name: '',
    });

    // Act
    const response = await sut.execute(payload);

    // Assert
    expect(response).toEqual(left(new InvalidNameError('')));
  });

  it('Should return an error when description is empty', async () => {
    // Arrange
    const { categoriesRepository, sut } = makeSut();
    const category = categoriesRepository.populate();
    const payload = mockProductData({
      categoryId: category.id,
      description: '',
    });

    // Act
    const response = await sut.execute(payload);

    // Assert
    expect(response).toEqual(left(new EmptyDescriptionError()));
  });

  it('Should return an error when description length is greater than 255 characters', async () => {
    // Arrange
    const { categoriesRepository, sut } = makeSut();
    const category = categoriesRepository.populate();
    const payload = mockProductData({
      categoryId: category.id,
      description: faker.lorem.words(256),
    });

    // Act
    const response = await sut.execute(payload);

    // Assert
    expect(response).toEqual(left(new InvalidDescriptionLengthError()));
  });

  it('Should create product', async () => {
    // Arrange
    const { categoriesRepository, sut } = makeSut();
    const category = categoriesRepository.populate();
    const payload = mockProductData({
      categoryId: category.id,
    });

    // Act
    const response = await sut.execute(payload);

    // Assert
    expect(response.isRight() && response.value).toBeInstanceOf(Product);
  });
});
