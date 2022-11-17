import { CategoryDTO } from '@/presentation/dto';
import { ListCategoriesUseCase } from '@/useCases/category';
import { InMemoryCategoriesRepository } from '@tests/mocks/category.repository';
import { ListCategoriesHandler } from '.';

const makeSut = (executeMock?: () => unknown) => {
  const useCase = {
    execute: executeMock ?? vi.fn(),
  } as unknown as ListCategoriesUseCase;
  const sut = new ListCategoriesHandler(useCase);

  return { sut, useCase };
};

describe('List categories handler', () => {
  it('Should call use case execute method', async () => {
    // Arrange
    const { sut, useCase } = makeSut();

    // Act
    await sut.handle();

    // Assert
    expect(useCase.execute).toHaveBeenCalled();
  });

  it('Should call use case execute method', async () => {
    // Arrange
    const repository = new InMemoryCategoriesRepository();

    for (let count = 0; count <= 5; count++) {
      repository.populate();
    }

    const executeMock = () => repository.listAll();
    const { sut } = makeSut(executeMock);

    // Act
    const response = await sut.handle();

    // Assert
    response.body?.forEach((category) => {
      expect(category).toBeInstanceOf(CategoryDTO);
    });
  });
});
