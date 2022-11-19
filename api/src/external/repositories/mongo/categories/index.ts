import { CategoriesRepository } from '@/useCases/ports';
import { CategorySchema } from '@/external/schemas/Category';
import { Category } from '@/entities';

export class MongoCategoriesRepository implements CategoriesRepository {
  public async exists(name: string): Promise<boolean> {
    const category = await CategorySchema.exists({ name });

    if (!category) return false;

    return true;
  }

  public async listAll(): Promise<Category[]> {
    const categories = await CategorySchema.find();

    return categories.map((document) => {
      const category = Category.create(
        {
          icon: document.icon,
          name: document.name,
        },
        document.id
      );

      if (category.isLeft()) {
        throw new Error(`Category with id ${document.id} is invalid`);
      }

      return category.value;
    });
  }

  public async save(category: Category): Promise<void> {
    await CategorySchema.create({
      id: category.id,
      icon: category.icon.value,
      name: category.name.value,
    });
  }

  public async findById(categoryId: string): Promise<Category | undefined> {
    const document = await CategorySchema.findOne().where({ id: categoryId });

    if (!document) return undefined;

    const category = Category.create(
      {
        icon: document.icon,
        name: document.name,
      },
      document.id
    );

    if (category.isLeft()) {
      throw new Error(`Category with id ${document.id} is invalid`);
    }

    return category.value;
  }
}
