import { Product } from '@/entities';
import { ProductsRepository } from '@/useCases/ports';
import { UseCase } from '@/useCases/types/useCase';

export class ListProductsUseCase implements UseCase<undefined, Product[]> {
  constructor(private readonly repository: ProductsRepository) {}

  public async execute(): Promise<Product[]> {
    const categories = await this.repository.listAll();

    return categories;
  }
}
