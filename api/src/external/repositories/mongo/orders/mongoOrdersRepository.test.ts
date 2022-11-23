import { Order, Status } from '@/entities';
import { MongoOrdersRepository } from '@/external/repositories/mongo/orders';
import { OrderSchema } from '@/external/schemas/Order';
import { faker } from '@faker-js/faker';
import { mockOrderData } from '@tests/mocks';

vi.mock('@/external/schemas/Order');

describe('Mongo orders repository', () => {
  it('Should throw when order format is invalid', async () => {
    // Arrange
    const sut = new MongoOrdersRepository();
    const items = [];

    for (let i = 0; i < 11; i++) {
      items.push({
        productId: faker.datatype.uuid(),
        quantity: 1,
      });
    }

    vi.spyOn(OrderSchema, 'find').mockResolvedValueOnce([
      {
        createdAt: new Date().toISOString(),
        table: faker.datatype.number(),
        items,
        status: Status.WAITING,
      },
    ]);

    // Act & Assert
    await expect(sut.listAll()).rejects.toThrow();
  });

  it('Should return instances of Order', async () => {
    // Arrange
    const sut = new MongoOrdersRepository();

    vi.spyOn(OrderSchema, 'find').mockResolvedValueOnce([
      {
        createdAt: new Date().toISOString(),
        table: faker.datatype.number(),
        items: [
          {
            productId: faker.datatype.uuid(),
            quantity: 1,
          },
        ],
        status: Status.WAITING,
      },
    ]);

    const response = await sut.listAll();

    // Assert
    expect(response[0]).toBeInstanceOf(Order);
  });

  it('Should call schema update method', async () => {
    // Arrange
    const sut = new MongoOrdersRepository();
    const order = Order.create(mockOrderData());

    if (order.isLeft()) {
      throw new Error('Invalid order');
    }

    const spy = vi.spyOn(OrderSchema, 'updateOne');

    await sut.update(order.value);

    // Assert
    expect(spy).toHaveBeenCalled();
  });
});
