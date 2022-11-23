import { Order, Status } from '@/entities';
import { OrderSchema } from '@/external/schemas/Order';
import { OrdersRepository } from '@/useCases/ports/ordersRepository';

export class MongoOrdersRepository implements OrdersRepository {
  public async listAll(): Promise<Order[]> {
    const documents = await OrderSchema.find();

    return documents
      .map((document) => {
        const status = Object.values(Status).find(
          (value) => value === document.status
        ) as Status;
        const order = Order.create(
          {
            items: document.items,
            table: document.table,
          },
          document.id,
          document.createdAt,
          status
        );

        if (order.isLeft()) {
          throw new Error('Invalid order');
        }

        return order.value;
      })
      .sort((orderA, orderB) => (orderA.createdAt > orderB.createdAt ? 1 : -1));
  }

  public async save(order: Order): Promise<void> {
    await OrderSchema.create({
      createdAt: order.createdAt,
      id: order.id,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      status: order.status,
      table: order.table,
    });
  }

  public async findById(id: string): Promise<Order | undefined> {
    const document = await OrderSchema.findOne({ id });

    if (!document) return undefined;

    const order = Order.create(
      {
        items: document.items,
        table: document.table,
      },
      document.id,
      document.createdAt,
      Status[document.status.toUpperCase() as keyof typeof Status]
    );

    if (order.isLeft()) {
      throw new Error('Invalid order');
    }

    return order.value;
  }

  public async update(order: Order): Promise<void> {
    await OrderSchema.updateOne(
      { id: order.id },
      { $set: { status: order.status } }
    );
  }
}
