import { InMemoryOrdersRepository } from '@tests/mocks';
import { ListOrdersUseCase } from '@/useCases/order';
import { InMemoryProductsRepository } from '@tests/mocks/product.repository';

const makeSut = () => {
  const ordersRepository = new InMemoryOrdersRepository();
  const productsRepository = new InMemoryProductsRepository();
  const sut = new ListOrdersUseCase(ordersRepository, productsRepository);

  return { ordersRepository, sut };
};

describe('List order use case', () => {
  it('Should return an empty array when there is no orders', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const response = await sut.execute();

    // Assert
    expect(response).toEqual([]);
  });

  it('Should return an array with orders', async () => {
    // Arrange
    const { ordersRepository, sut } = makeSut();

    ordersRepository.populate();
    ordersRepository.populate();

    // Act
    const response = await sut.execute();

    // Assert
    expect(response.length).toBe(2);
  });
});
