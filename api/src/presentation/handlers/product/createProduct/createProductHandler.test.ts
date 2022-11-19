import { Product } from '@/entities';
import {
  InvalidDescriptionLengthError,
  InvalidIconError,
  InvalidIconLengthError,
} from '@/entities/errors';
import { ProductDTO } from '@/presentation/dto';
import { CreateProductHandler } from '@/presentation/handlers/product';
import { HttpError } from '@/presentation/helpers';
import { left } from '@/shared';
import { CategoryNotFoundError } from '@/useCases/errors';
import { faker } from '@faker-js/faker';
import { mockProductData } from '@tests/mocks';

const makeSut = (executeMock = vi.fn()) => {
  const useCase = {
    execute: executeMock,
  };
  const sut = new CreateProductHandler(useCase);

  return { sut };
};

describe('Create product handler', () => {
  it('Should return 400 when categoryId is missing in request', async () => {
    // Arrange
    const body = mockProductData({ categoryId: '' });
    const { sut } = makeSut();

    // Act
    const response = await sut.handle({ body });

    // Assert
    expect(response.statusCode).toBe(400);
    expect((response.body as HttpError)?.error).toBe(
      'Missing param: categoryId'
    );
  });

  it('Should return 400 when description is missing in request', async () => {
    // Arrange
    const body = mockProductData({ description: '' });
    const { sut } = makeSut();

    // Act
    const response = await sut.handle({ body });

    // Assert
    expect(response.statusCode).toBe(400);
    expect((response.body as HttpError)?.error).toBe(
      'Missing param: description'
    );
  });

  it('Should return 422 when description length is greater than 256 characters', async () => {
    // Arrange
    const body = mockProductData({ description: faker.lorem.words(256) });
    const executeMock = vi.fn(() => left(new InvalidDescriptionLengthError()));
    const { sut } = makeSut(executeMock);

    // Act
    const response = await sut.handle({ body });

    // Assert
    expect(response.statusCode).toBe(422);
  });

  it('Should return 400 when image name is missing', async () => {
    // Arrange
    const body = mockProductData({ imageName: '' });
    const { sut } = makeSut();

    // Act
    const response = await sut.handle({ body });

    // Assert
    expect(response.statusCode).toBe(400);
    expect((response.body as HttpError)?.error).toBe(
      'Missing param: imageName'
    );
  });

  it('Should return 422 when ingredient icon contains any letter', async () => {
    // Arrange
    const body = mockProductData({ ingredientName: faker.lorem.word() });
    const executeMock = vi.fn(() => left(new InvalidIconError()));
    const { sut } = makeSut(executeMock);

    // Act
    const response = await sut.handle({ body });

    // Assert
    expect(response.statusCode).toBe(422);
    expect((response.body as HttpError)?.error).toBe(
      'Icon must be an emoji character. Try to send a single emoji character.'
    );
  });

  it('Should return 422 when ingredient icon contains more than a single emoji', async () => {
    // Arrange
    const icon = '🧀🍕';
    const body = mockProductData({ ingredientName: icon });
    const executeMock = vi.fn(() => left(new InvalidIconLengthError(icon)));
    const { sut } = makeSut(executeMock);

    // Act
    const response = await sut.handle({ body });

    // Assert
    expect(response.statusCode).toBe(422);
    expect((response.body as HttpError)?.error).toBe(
      `Icon should be a single emoji. Received ${icon} instead`
    );
  });

  it('Should return 400 when price is missing', async () => {
    // Arrange
    const body = mockProductData({ price: 0 });
    const { sut } = makeSut();

    // Act
    const response = await sut.handle({ body });

    // Assert
    expect(response.statusCode).toBe(400);
    expect((response.body as HttpError)?.error).toBe('Missing param: price');
  });

  it('Should return 404 when category does not exists', async () => {
    // Arrange
    const body = mockProductData();
    const executeMock = vi.fn(() => left(new CategoryNotFoundError()));
    const { sut } = makeSut(executeMock);

    // Act
    const response = await sut.handle({ body });

    // Assert
    expect(response.statusCode).toBe(404);
    expect((response.body as HttpError)?.error).toBe(
      'Category does not exists.'
    );
  });

  it('Should return 201 when product was created', async () => {
    // Arrange
    const body = mockProductData();
    const executeMock = vi.fn(() => Product.create(mockProductData()));
    const { sut } = makeSut(executeMock);

    // Act
    const response = await sut.handle({ body });

    // Assert
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeInstanceOf(ProductDTO);
  });
});
