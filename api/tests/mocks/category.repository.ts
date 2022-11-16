import { Category } from '@/entities';
import { CategoriesRepository } from '@/useCases/ports';
import { mockCategoryData } from './category.mock';

export class InMemoryCategoriesRepository implements CategoriesRepository {
  private readonly database = new Map<string, Category>();

  public async exists(name: string): Promise<boolean> {
    const category = [...this.database.values()].find(
      (category) => category.name.value === name
    );

    if (!category) return Promise.resolve(false);

    return Promise.resolve(true);
  }

  public async save(category: Category): Promise<void> {
    this.database.set(category.id, category);
  }

  public async populate(): Promise<Category> {
    const data = mockCategoryData();
    const category = Category.create(data);

    if (category.isLeft()) {
      throw new Error('Error to populate in memory database');
    }

    await this.save(category.value);

    return category.value;
  }
}
