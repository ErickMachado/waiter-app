import { left } from '@/shared';
import { mockOrderData } from '@tests/mocks/order.mock';
import { Order, Status } from '@/entities';
import { OrderItemsLengthError } from '@/entities/errors';

describe('Order entity', () => {
  it('Should return an error when items length is grater than 10', () => {
    // Arrange
    const data = mockOrderData({ numberOfItems: 11 });

    // Act
    const sut = Order.create(data);

    // Assert
    expect(sut).toEqual(left(new OrderItemsLengthError()));
  });

  it('Should create a new order', () => {
    // Arrange
    const data = mockOrderData();

    // Act
    const sut = Order.create(data);

    // Assert
    expect(sut.isRight() && sut.value).toBeInstanceOf(Order);
  });

  it('Should set new order status as "Waiting"', () => {
    // Arrange
    const data = mockOrderData();

    // Act
    const sut = Order.create(data);

    // Assert
    expect(sut.isRight() && sut.value.status).toBe(Status.WAITING);
  });
});
