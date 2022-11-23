import { left, right } from '@/shared';
import { InvalidOrderStatusError, OrderNotFoundError } from '@/useCases/errors';
import { faker } from '@faker-js/faker';
import { InMemoryOrdersRepository } from '@tests/mocks';
import { ChangeOrderStatusUseCase } from '@/useCases/order';
import { InMemoryProductsRepository } from '@tests/mocks/product.repository';
import { Status } from '@/entities';

const makeSut = () => {
  const ordersRepository = new InMemoryOrdersRepository();
  const productsRepository = new InMemoryProductsRepository();
  const sut = new ChangeOrderStatusUseCase(
    ordersRepository,
    productsRepository
  );

  return { ordersRepository, productsRepository, sut };
};

describe('Change order status use case', () => {
  it('Should return OrderNotFound error when order does not exists', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const response = await sut.execute({
      orderId: faker.datatype.uuid(),
      status: 'Waiting',
    });

    // Assert
    expect(response).toEqual(left(new OrderNotFoundError()));
  });

  it('Should return invalidOrderStatus error when provided status is invalid', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const response = await sut.execute({
      orderId: faker.datatype.uuid(),
      status: faker.lorem.word(),
    });

    // Assert
    expect(response).toEqual(left(new InvalidOrderStatusError()));
  });

  it('Should call products repository findById method to populate order', async () => {
    // Arrange
    const { ordersRepository, productsRepository, sut } = makeSut();
    const spy = vi.spyOn(productsRepository, 'findById');

    const product = productsRepository.populate();
    const order = ordersRepository.populate(product.id);

    // Act
    await sut.execute({
      orderId: order.id,
      status: Status.IN_PRODUCTION,
    });

    // Assert
    expect(spy).toHaveBeenCalledWith(product.id);
  });

  it('Should call products repository findById method to populate order', async () => {
    // Arrange
    const { ordersRepository, productsRepository, sut } = makeSut();

    const product = productsRepository.populate();
    const order = ordersRepository.populate(product.id);

    // Act
    const response = await sut.execute({
      orderId: order.id,
      status: Status.IN_PRODUCTION,
    });

    // Assert
    expect(response).toEqual(right(order));
  });
});
