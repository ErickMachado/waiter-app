import { Product } from '@/entities';

export interface ProductsRepository {
  save(product: Product): Promise<void>;
}
