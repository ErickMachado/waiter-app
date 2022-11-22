import { InMemoryOrdersRepository, mockOrderData } from '@tests/mocks';
import { InMemoryProductsRepository } from '@tests/mocks/product.repository';
import { CreateOrderUseCase } from '@/useCases/order';
import { left } from '@/shared';
import { ProductNotFoundError } from '@/useCases/errors';
import { Order } from '@/entities';
import { OrderItemsLengthError } from '@/entities/errors';

const makeSut = () => {
  const productsRepository = new InMemoryProductsRepository();
  const ordersRepository = new InMemoryOrdersRepository();
  const sut = new CreateOrderUseCase(productsRepository, ordersRepository);

  return { productsRepository, ordersRepository, sut };
};

describe('Create order use case', () => {
  it('Should return an error when the product in items does not exists', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const response = await sut.execute(mockOrderData());

    // Assert
    expect(response).toEqual(left(new ProductNotFoundError()));
  });

  it('Should return created order', async () => {
    // Arrange
    const { productsRepository, sut } = makeSut();

    const { id } = productsRepository.populate();

    // Act
    const response = await sut.execute(mockOrderData({ productId: id }));

    // Assert
    expect(response.isRight() && response.value).toBeInstanceOf(Order);
  });

  it('Should return an error when orders length is greater than 10', async () => {
    // Arrange
    const { productsRepository, sut } = makeSut();

    const { id } = productsRepository.populate();

    // Act
    const response = await sut.execute(
      mockOrderData({ productId: id, numberOfItems: 11 })
    );

    // Assert
    expect(response).toEqual(left(new OrderItemsLengthError()));
  });
});
