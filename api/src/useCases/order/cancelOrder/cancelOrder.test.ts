import { left } from '@/shared';
import { OrderNotFoundError } from '@/useCases/errors';
import { InMemoryOrdersRepository } from '@tests/mocks';
import cuid from 'cuid';
import { CancelOrderUseCase } from '.';

const makeSut = () => {
  const repository = new InMemoryOrdersRepository();
  const sut = new CancelOrderUseCase(repository);

  return { repository, sut };
};

describe('CancelOrderUseCase', () => {
  it('Should return OrderNotFound error when order does not exists in database', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const response = await sut.execute(cuid());

    // Assert
    expect(response).toEqual(left(new OrderNotFoundError()));
  });

  it('Should should call repository method to delete an order by id', async () => {
    // Arrange
    const { repository, sut } = makeSut();
    const order = repository.populate();
    const spy = vi.spyOn(repository, 'delete');

    // Act
    await sut.execute(order.id);

    // Assert
    expect(spy).toHaveBeenCalledWith(order.id);
  });
});
