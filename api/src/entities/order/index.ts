import { Either, left, right } from '@/shared';
import { OrderItemsLengthError } from '@/entities/errors';
import cuid from 'cuid';
import { Product } from '../product';

export interface Item {
  productId: string;
  product?: Product;
  quantity: number;
}

export enum Status {
  DONE = 'Done',
  IN_PRODUCTION = 'InProduction',
  WAITING = 'Waiting',
}

export interface OrderData {
  items: Item[];
  table: string;
}

export class Order {
  public readonly createdAt: string;
  public readonly id: string;
  public status: Status;

  private constructor(
    public items: Item[],
    public readonly table: string,
    id?: string,
    createdAt?: string,
    status?: Status
  ) {
    this.createdAt = createdAt ?? new Date().toISOString();
    this.status = status ?? Status.WAITING;
    this.id = id ?? cuid();
  }

  public updateStatus(status: Status) {
    this.status = status;
  }

  public static create(
    data: OrderData,
    id?: string,
    createdAt?: string,
    status?: Status
  ): Either<OrderItemsLengthError, Order> {
    if (data.items.length > 10) return left(new OrderItemsLengthError());

    return right(new Order(data.items, data.table, id, createdAt, status));
  }
}
