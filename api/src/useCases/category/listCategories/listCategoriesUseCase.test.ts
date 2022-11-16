import { ListCategoriesUseCase } from '@/useCases/category';
import { InMemoryCategoriesRepository } from '@tests/mocks/category.repository';

const makeSut = () => {
  const repository = new InMemoryCategoriesRepository();
  const sut = new ListCategoriesUseCase(repository);

  return { repository, sut };
};

describe('List categories use case', () => {
  it('Should call repository method to list all categories in database', async () => {
    // Arrange
    const { repository, sut } = makeSut();
    const spy = vi.spyOn(repository, 'listAll');

    // Act
    await sut.execute();

    // Assert
    expect(spy).toHaveBeenCalled();
  });
});
