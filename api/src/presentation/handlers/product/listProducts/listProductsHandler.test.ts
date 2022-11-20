import { Product } from '@/entities';
import { ListProductsHandler } from '@/presentation/handlers/product';
import { mockProductData } from '@tests/mocks';

const makeSut = (executeMock = vi.fn()) => {
  const useCase = {
    execute: executeMock,
  };
  const sut = new ListProductsHandler(useCase);

  return { sut };
};

describe('List products handler', () => {
  it('Should return a list of products', async () => {
    // Arrange
    const product = Product.create(mockProductData());

    if (product.isLeft()) {
      throw new Error('Invalid product');
    }

    const executeMock = vi.fn(() => [product]);
    const { sut } = makeSut(executeMock);

    // Act
    const response = await sut.handle();

    // Assert
    expect(response.statusCode).toBe(200);
  });

  it('Should return an empty list when there is no products', async () => {
    // Arrange
    const { sut } = makeSut(vi.fn(() => []));

    // Act
    const response = await sut.handle();

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('Should return internal server error when an unknown error happens', async () => {
    // Arrange
    const { sut } = makeSut(
      vi.fn(() => {
        throw new Error('Test');
      })
    );

    // Act
    const response = await sut.handle();

    // Assert
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeUndefined();
  });
});
