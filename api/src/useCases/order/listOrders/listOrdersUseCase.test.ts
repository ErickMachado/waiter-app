import { InMemoryOrdersRepository } from '@tests/mocks';
import { ListOrdersUseCase } from '@/useCases/order';

const makeSut = () => {
  const repository = new InMemoryOrdersRepository();
  const sut = new ListOrdersUseCase(repository);

  return { repository, sut };
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
    const { repository, sut } = makeSut();

    repository.populate();
    repository.populate();

    // Act
    const response = await sut.execute();

    // Assert
    expect(response.length).toBe(2);
  });
});
