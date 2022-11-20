import { ProductSchema } from '@/external/schemas/Product';
import { MongoProductsRepository } from '@/external/repositories/mongo/products';
import { Product } from '@/entities';
import { mockProductData } from '@tests/mocks';

vi.mock('@/external/schemas/Product');

describe('Mongo products repository', () => {
  it('Should call schema create method to create a new product', async () => {
    // Arrange
    const spy = vi.spyOn(ProductSchema, 'create');
    const sut = new MongoProductsRepository();
    const product = Product.create(mockProductData());

    if (product.isLeft()) {
      throw new Error('Invalid product');
    }

    // Act
    await sut.save(product.value);

    // Assert
    expect(spy).toHaveBeenCalled();
  });
});
