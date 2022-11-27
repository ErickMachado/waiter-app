import { Item, OrderData, Product } from '@/entities';
import { faker } from '@faker-js/faker';
import { mockProductData } from './product.mock';

interface MockOptions {
  numberOfItems: number;
  itemsQuantity: number;
  productId: string;
  table: string;
}

export function mockOrderData(data?: Partial<MockOptions>): OrderData {
  const numberOfItems = data?.numberOfItems ?? 1;
  const items: Item[] = [];

  for (let count = 0; count < numberOfItems; count++) {
    const product = Product.create(mockProductData());

    if (product.isLeft()) {
      throw new Error('Invalid product');
    }

    items.push({
      product: product.value,
      productId: data?.productId || faker.datatype.uuid(),
      quantity: data?.itemsQuantity || 1,
    });
  }

  return {
    items,
    table: data?.table ?? faker.datatype.number().toString(),
  };
}
