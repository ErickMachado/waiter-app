import { Category } from '@/entities';
import { CategoriesRepository } from '@/useCases/ports';

export class ListCategoriesUseCase {
  constructor(private readonly repository: CategoriesRepository) {}

  public async execute(): Promise<Category[]> {
    const categories = await this.repository.listAll();

    return categories;
  }
}
