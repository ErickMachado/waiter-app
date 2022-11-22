import { Order } from '@/entities';
import { CreateOrderHandler } from '@/presentation/handlers/order';
import { left, right } from '@/shared';
import { ProductNotFoundError } from '@/useCases/errors';
import { mockOrderData } from '@tests/mocks';

const makeSut = (executeMock = vi.fn()) => {
  const useCase = {
    execute: executeMock,
  };
  const sut = new CreateOrderHandler(useCase);

  return { sut };
};

describe('Create order handler', () => {
  it('Should return bad request when table is not provided', async () => {
    // Arrange
    const { sut } = makeSut();
    const payload = mockOrderData({ table: '' });

    // Act
    const { body, statusCode } = await sut.handle({ body: payload });

    // Assert
    expect(statusCode).toBe(400);
    expect(body).toStrictEqual({
      error: 'Missing param: table',
      type: 'MissingParamError',
    });
  });

  it('Should return bad request when items is not provided', async () => {
    // Arrange
    const { sut } = makeSut();
    const payload = mockOrderData({ numberOfItems: 0 });

    // Act
    const { body, statusCode } = await sut.handle({ body: payload });

    // Assert
    expect(statusCode).toBe(400);
    expect(body).toStrictEqual({
      error: 'Missing param: items',
      type: 'MissingParamError',
    });
  });

  it('Should return not found when product provided on the order doest not exists', async () => {
    // Arrange
    const executeMock = vi.fn(() => left(new ProductNotFoundError()));
    const { sut } = makeSut(executeMock);
    const payload = mockOrderData();

    // Act
    const { body, statusCode } = await sut.handle({ body: payload });

    // Assert
    expect(statusCode).toBe(404);
    expect(body).toStrictEqual({
      error: 'Product does not exists.',
      type: 'ProductNotFoundError',
    });
  });

  it('Should return internal server error when an unknown error happens', async () => {
    // Arrange
    const executeMock = vi.fn(() => {
      throw new Error('Test');
    });
    const { sut } = makeSut(executeMock);
    const payload = mockOrderData();

    // Act
    const { body, statusCode } = await sut.handle({ body: payload });

    // Assert
    expect(statusCode).toBe(500);
    expect(body).toBeUndefined();
  });

  it('Should return created when order was successfully created', async () => {
    // Arrange
    const order = Order.create(mockOrderData());

    if (order.isLeft()) {
      throw new Error('Invalid order');
    }

    const executeMock = vi.fn(() => right(order.value));
    const { sut } = makeSut(executeMock);
    const payload = mockOrderData();

    // Act
    const { body, statusCode } = await sut.handle({ body: payload });

    // Assert
    expect(statusCode).toBe(201);
    expect(body).toBeInstanceOf(Order);
  });
});
