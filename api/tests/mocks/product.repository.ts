import { Product } from '@/entities';
import { ProductsRepository } from '@/useCases/ports';
import { faker } from '@faker-js/faker';
import { mockProductData } from '@tests/mocks/product.mock';

export class InMemoryProductsRepository implements ProductsRepository {
  private database = new Map<string, Product>();

  public async listAll(): Promise<Product[]> {
    return [...this.database.values()];
  }

  public async save(product: Product): Promise<void> {
    this.database.set(product.id, product);
  }

  public populate(categoryId = faker.datatype.uuid()): Product {
    const product = Product.create(mockProductData({ categoryId }));

    if (product.isLeft()) {
      throw new Error('Invalid product mock');
    }

    this.database.set(product.value.id, product.value);

    return product.value;
  }

  public async listAllByCategoryId(categoryId: string): Promise<Product[]> {
    const categories = [...this.database.values()].filter(
      (product) => product.categoryId === categoryId
    );

    return categories;
  }

  public async findById(productId: string): Promise<Product | undefined> {
    return [...this.database.values()].find(({ id }) => id === productId);
  }

  public async exists(productId: string): Promise<boolean> {
    if (!this.database.get(productId)) return false;

    return true;
  }
}
