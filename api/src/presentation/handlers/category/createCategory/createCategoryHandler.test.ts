import { Category } from '@/entities';
import { InvalidIconLengthError } from '@/entities/errors';
import { MissingParamError } from '@/presentation/errors';
import { CreateCategoryHandler } from '@/presentation/handlers/category';
import { left } from '@/shared';
import { CreateCategoryUseCase } from '@/useCases/category';
import { CategoryConflictError } from '@/useCases/errors';
import { mockCategoryData } from '@tests/mocks';

const makeSut = (executeMock?: () => unknown) => {
  const useCase = {
    execute: executeMock ?? vi.fn(),
  } as unknown as CreateCategoryUseCase;
  const sut = new CreateCategoryHandler(useCase);

  return { sut, useCase };
};

describe('Create category handler', () => {
  it('Should return bad request when name is not sent on request', async () => {
    // Arrange
    const payload = mockCategoryData({ name: '' });
    const { sut } = makeSut();

    // Act
    const response = await sut.handle({ body: payload });

    // Assert
    expect(response.body).toEqual(new MissingParamError('name'));
    expect(response.statusCode).toBe(400);
  });

  it('Should return bad request when icon is not sent on request', async () => {
    // Arrange
    const payload = mockCategoryData({ icon: '' });
    const { sut } = makeSut();

    // Act
    const response = await sut.handle({ body: payload });

    // Assert
    expect(response.body).toEqual(new MissingParamError('icon'));
    expect(response.statusCode).toBe(400);
  });

  it('Should return unprocessable entity when icon is invalid', async () => {
    // Arrange
    const payload = mockCategoryData({ icon: '🍕🍎' });
    const executeMock = () => {
      return left(new InvalidIconLengthError(payload.icon));
    };
    const { sut } = makeSut(executeMock);

    // Act
    const response = await sut.handle({ body: payload });

    // Assert
    expect(response.body).toEqual(new InvalidIconLengthError(payload.icon));
    expect(response.statusCode).toBe(429);
  });

  it('Should return conflict when category already exists', async () => {
    // Arrange
    const payload = mockCategoryData();
    const executeMock = () => {
      return left(new CategoryConflictError(payload.name));
    };
    const { sut } = makeSut(executeMock);

    // Act
    const response = await sut.handle({ body: payload });

    // Assert
    expect(response.body).toEqual(new CategoryConflictError(payload.name));
    expect(response.statusCode).toBe(409);
  });

  it('Should return internal server error when an unknown error happens', async () => {
    // Arrange
    const payload = mockCategoryData();
    const executeMock = () => {
      throw new Error('Test');
    };
    const { sut } = makeSut(executeMock);

    // Act
    const response = await sut.handle({ body: payload });

    // Assert
    expect(response.body).toBeUndefined();
    expect(response.statusCode).toBe(500);
  });

  it('Should return created when a category is created', async () => {
    // Arrange
    const payload = mockCategoryData();
    const executeMock = () => Category.create(payload);
    const { sut } = makeSut(executeMock);

    // Act
    const response = await sut.handle({ body: payload });

    // Assert
    expect(response.body).toBeInstanceOf(Category);
    expect(response.statusCode).toBe(201);
  });
});
