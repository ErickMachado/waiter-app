import { Product } from '@/entities';
import { ListProductsByCategoryHandler } from '@/presentation/handlers/category';
import { left, right } from '@/shared';
import { CategoryNotFoundError } from '@/useCases/errors';
import { faker } from '@faker-js/faker';
import { mockProductData } from '@tests/mocks';

const makeSut = (executeMock = vi.fn()) => {
  const useCase = {
    execute: executeMock,
  };
  const sut = new ListProductsByCategoryHandler(useCase);

  return { sut };
};

describe('List products by category id handler', () => {
  it('Should return not found when category does not exists', async () => {
    // Arrange
    const executeMock = vi.fn(() => left(new CategoryNotFoundError()));
    const { sut } = makeSut(executeMock);

    // Act
    const { body, statusCode } = await sut.handle({
      params: {
        categoryId: faker.datatype.uuid(),
      },
    });

    // Assert
    expect(statusCode).toBe(404);
    expect(body).toStrictEqual({
      error: 'Category does not exists.',
      type: 'CategoryNotFoundError',
    });
  });

  it('Should return an OK with a list of products', async () => {
    // Arrange
    const product = Product.create(mockProductData());

    if (product.isLeft()) {
      throw new Error('Invalid product');
    }

    const executeMock = vi.fn(() => right([product.value]));
    const { sut } = makeSut(executeMock);

    // Act
    const { body, statusCode } = await sut.handle({
      params: {
        categoryId: faker.datatype.uuid(),
      },
    });

    // Assert
    expect(statusCode).toBe(200);
    expect(body).toStrictEqual([product.value]);
  });

  it('Should return an internal server error', async () => {
    // Arrange
    const executeMock = vi.fn(() => {
      throw new Error('Test');
    });
    const { sut } = makeSut(executeMock);

    // Act
    const { body, statusCode } = await sut.handle({
      params: {
        categoryId: faker.datatype.uuid(),
      },
    });

    // Assert
    expect(statusCode).toBe(500);
    expect(body).toBeUndefined();
  });
});
