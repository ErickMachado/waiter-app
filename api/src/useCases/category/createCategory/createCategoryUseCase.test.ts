import { Category } from '@/entities';
import {
  InvalidIconError,
  InvalidIconLengthError,
  InvalidNameError,
} from '@/entities/errors';
import { left } from '@/shared';
import { CreateCategoryUseCase } from '@/useCases/category';
import { faker } from '@faker-js/faker';
import { mockCategoryData } from '@tests/mocks';
import { InMemoryCategoriesRepository } from '@tests/mocks/category.repository';
import { CategoryConflictError } from '@/useCases/errors';

const makeSut = () => {
  const repository = new InMemoryCategoriesRepository();
  const sut = new CreateCategoryUseCase(repository);

  return { repository, sut };
};

describe('Create category use case', () => {
  it('Should return an error when a category name conflicts', async () => {
    // Arrange
    const { repository, sut } = makeSut();
    const category = await repository.populate();
    const dataMock = mockCategoryData({ name: category.name.value });

    // Act
    const response = await sut.execute(dataMock);

    // Assert
    expect(response).toEqual(left(new CategoryConflictError(dataMock.name)));
  });

  it('Should return an error when a category name is empty', async () => {
    // Arrange
    const { sut } = makeSut();
    const dataMock = mockCategoryData({ name: '' });

    // Act
    const response = await sut.execute(dataMock);

    // Assert
    expect(response).toEqual(left(new InvalidNameError(dataMock.name)));
  });

  it('Should return an error when a category icon length is invalid', async () => {
    // Arrange
    const { sut } = makeSut();
    const dataMock = mockCategoryData({ icon: '🍕🍎' });

    // Act
    const response = await sut.execute(dataMock);

    // Assert
    expect(response).toEqual(left(new InvalidIconLengthError(dataMock.icon)));
  });

  it('Should return an error when a category icon is invalid', async () => {
    // Arrange
    const { sut } = makeSut();
    const dataMock = mockCategoryData({ icon: faker.lorem.word() });

    // Act
    const response = await sut.execute(dataMock);

    // Assert
    expect(response).toEqual(left(new InvalidIconError(dataMock.icon)));
  });

  it('Should call repository method to check if a category with the provided name already exists', async () => {
    // Arrange
    const { repository, sut } = makeSut();
    const spy = vi.spyOn(repository, 'exists');
    const dataMock = mockCategoryData();

    // Act
    await sut.execute(dataMock);

    // Assert
    expect(spy).toHaveBeenCalledWith(dataMock.name);
  });

  it('Should call repository method save a new category', async () => {
    // Arrange
    const { repository, sut } = makeSut();
    const spy = vi.spyOn(repository, 'save');
    const dataMock = mockCategoryData();

    // Act
    await sut.execute(dataMock);

    // Assert
    expect(spy).toHaveBeenCalled();
  });

  it('Should return an instance of Category class', async () => {
    // Arrange
    const { sut } = makeSut();
    const dataMock = mockCategoryData();

    // Act
    const response = await sut.execute(dataMock);

    // Assert
    expect(response.isRight() && response.value).toBeInstanceOf(Category);
  });
});
