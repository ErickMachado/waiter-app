import { CancelOrderHandler } from '@/presentation/handlers/order';
import { left, right } from '@/shared';
import { OrderNotFoundError } from '@/useCases/errors';
import cuid from 'cuid';

const makeSut = (executeMock = vi.fn()) => {
  const useCase = {
    execute: executeMock,
  };
  const sut = new CancelOrderHandler(useCase);

  return { sut };
};

describe('Cancel order handler -> Cancel order', async () => {
  it('When order id is not in request body, expect the handler to return a status code equal to 400 along with the error message', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const { body, statusCode } = await sut.handle({ body: { orderId: '' } });

    // Assert
    expect(statusCode).toBe(400);
    expect(body).toStrictEqual({
      error: 'Missing param: orderId',
      type: 'MissingParamError',
    });
  });

  it('When use case returns an OrderNotFound error, expect handler to return a status code equal to 404 along with the error message', async () => {
    // Arrange
    const executeMock = vi.fn(() => left(new OrderNotFoundError()));
    const { sut } = makeSut(executeMock);

    // Act
    const { body, statusCode } = await sut.handle({
      body: { orderId: cuid() },
    });

    // Assert
    expect(statusCode).toBe(404);
    expect(body).toStrictEqual({
      error: 'Order does not exists.',
      type: 'OrderNotFoundError',
    });
  });

  it('When use case throw an error, expect handler to return a status code equal to 500 with no body', async () => {
    // Arrange
    const executeMock = vi.fn(() => {
      throw new Error('Test');
    });
    const { sut } = makeSut(executeMock);

    // Act
    const { body, statusCode } = await sut.handle({
      body: { orderId: cuid() },
    });

    // Assert
    expect(statusCode).toBe(500);
    expect(body).toBeUndefined();
  });

  it('When use case returns the order id, expect handler to return a status code equal to 204 with no body', async () => {
    // Arrange
    const executeMock = vi.fn(() => right(cuid()));
    const { sut } = makeSut(executeMock);

    // Act
    const { body, statusCode } = await sut.handle({
      body: { orderId: cuid() },
    });

    // Assert
    expect(statusCode).toBe(204);
    expect(body).toBeUndefined();
  });
});
