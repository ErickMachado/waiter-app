import { Item, OrderData } from '@/entities';
import { faker } from '@faker-js/faker';

interface MockOptions {
  numberOfItems: number;
  itemsQuantity: number;
  productId: string;
}

export function mockOrderData(data?: Partial<MockOptions>): OrderData {
  const numberOfItems = data?.numberOfItems || 1;
  const items: Item[] = [];

  for (let count = 0; count < numberOfItems; count++) {
    items.push({
      productId: data?.productId || faker.datatype.uuid(),
      quantity: data?.itemsQuantity || 1,
    });
  }

  return {
    items,
    table: faker.datatype.number().toString(),
  };
}
