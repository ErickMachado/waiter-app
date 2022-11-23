import { Order } from '@/entities';
import { OrderDTO } from '@/presentation/dto/order.dto';
import { ChangeOrderStatusHandler } from '@/presentation/handlers/order';
import { left, right } from '@/shared';
import { InvalidOrderStatusError, OrderNotFoundError } from '@/useCases/errors';
import { ChangeOrderStatusPayload } from '@/useCases/order';
import { faker } from '@faker-js/faker';
import { mockOrderData } from '@tests/mocks';

const makeSut = (executeMock = vi.fn()) => {
  const useCase = {
    execute: executeMock,
  };
  const sut = new ChangeOrderStatusHandler(useCase);

  return { sut, useCase };
};

describe('Change order status handler', () => {
  it('Should return bad request when order id is not provided in request body', async () => {
    // Arrange
    const { sut } = makeSut();
    const payload: ChangeOrderStatusPayload = {
      orderId: '',
      status: 'Waiting',
    };

    // Act
    const { body, statusCode } = await sut.handle({
      body: payload,
    });

    // Assert
    expect(statusCode).toBe(400);
    expect(body).toStrictEqual({
      error: 'Missing param: orderId',
      type: 'MissingParamError',
    });
  });

  it('Should return bad request when status is not provided in request body', async () => {
    // Arrange
    const { sut } = makeSut();
    const payload: ChangeOrderStatusPayload = {
      orderId: faker.datatype.uuid(),
      status: '',
    };

    // Act
    const { body, statusCode } = await sut.handle({
      body: payload,
    });

    // Assert
    expect(statusCode).toBe(400);
    expect(body).toStrictEqual({
      error: 'Missing param: status',
      type: 'MissingParamError',
    });
  });

  it('Should return not found when order does not exists', async () => {
    // Arrange
    const executeMock = vi.fn(() => left(new OrderNotFoundError()));
    const { sut } = makeSut(executeMock);
    const payload: ChangeOrderStatusPayload = {
      orderId: faker.datatype.uuid(),
      status: 'Waiting',
    };

    // Act
    const { body, statusCode } = await sut.handle({
      body: payload,
    });

    // Assert
    expect(statusCode).toBe(404);
    expect(body).toStrictEqual({
      error: 'Order does not exists.',
      type: 'OrderNotFoundError',
    });
  });

  it('Should return unprocessable entity when status is not accepted', async () => {
    // Arrange
    const executeMock = vi.fn(() => left(new InvalidOrderStatusError()));
    const { sut } = makeSut(executeMock);
    const payload: ChangeOrderStatusPayload = {
      orderId: faker.datatype.uuid(),
      status: 'Completed',
    };

    // Act
    const { body, statusCode } = await sut.handle({
      body: payload,
    });

    // Assert
    expect(statusCode).toBe(422);
    expect(body).toStrictEqual({
      error: 'Status is not valid.',
      type: 'InvalidOrderStatusError',
    });
  });

  it('Should return internal server error when an unknown error happens', async () => {
    // Arrange
    const executeMock = vi.fn(() => {
      throw new Error('Test');
    });
    const { sut } = makeSut(executeMock);
    const payload: ChangeOrderStatusPayload = {
      orderId: faker.datatype.uuid(),
      status: 'Waiting',
    };

    // Act
    const { body, statusCode } = await sut.handle({
      body: payload,
    });

    // Assert
    expect(statusCode).toBe(500);
    expect(body).toBeUndefined();
  });

  it('Should return ok when order is successfully updated', async () => {
    // Arrange
    const order = Order.create(mockOrderData());

    if (order.isLeft()) {
      throw new Error('Order is not valid');
    }

    const executeMock = vi.fn(() => right(order.value));
    const { sut } = makeSut(executeMock);
    const payload: ChangeOrderStatusPayload = {
      orderId: faker.datatype.uuid(),
      status: 'Waiting',
    };

    // Act
    const { body, statusCode } = await sut.handle({
      body: payload,
    });

    // Assert
    expect(statusCode).toBe(200);
    expect(body).toBeInstanceOf(OrderDTO);
  });
});
