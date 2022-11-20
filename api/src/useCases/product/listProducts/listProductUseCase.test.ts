import { InMemoryProductsRepository } from '@tests/mocks/product.repository';
import { ListProductsUseCase } from '.';

const makeSut = () => {
  const repository = new InMemoryProductsRepository();
  const sut = new ListProductsUseCase(repository);

  return { repository, sut };
};

describe('List products use case', () => {
  it('Should return registered products', async () => {
    // Arrange
    const { repository, sut } = makeSut();

    repository.populate();
    repository.populate();

    // Act
    const response = await sut.execute();

    // Assert
    expect(response.length).toBe(2);
  });

  it('Should return an empty array when there is no product', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const response = await sut.execute();

    // Assert
    expect(response.length).toBe(0);
  });
});
