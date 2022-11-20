import { Product } from '@/entities';
import { ProductsRepository } from '@/useCases/ports';
import { mockProductData } from '@tests/mocks/product.mock';

export class InMemoryProductsRepository implements ProductsRepository {
  private database = new Map<string, Product>();

  public async listAll(): Promise<Product[]> {
    return [...this.database.values()];
  }

  public async save(product: Product): Promise<void> {
    this.database.set(product.id, product);
  }

  public populate(): Product {
    const product = Product.create(mockProductData());

    if (product.isLeft()) {
      throw new Error('Invalid product mock');
    }

    this.database.set(product.value.id, product.value);

    return product.value;
  }
}
