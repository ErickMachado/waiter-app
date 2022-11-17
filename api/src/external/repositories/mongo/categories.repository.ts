import { CategoriesRepository } from '@/useCases/ports';
import { CategorySchema } from '@/external/schemas/Category';
import { Category, Icon, Name } from '@/entities';

export class MongoCategoriesRepository implements CategoriesRepository {
  public async exists(name: string): Promise<boolean> {
    const category = await CategorySchema.exists({ name });

    if (!category) return false;

    return true;
  }

  public async listAll(): Promise<Category[]> {
    const categories = await CategorySchema.find();

    return categories.map((document) => {
      const icon = Icon.parse(document.icon);
      const name = Name.parse(document.name);
      const id: string = document.id;

      if (icon.isLeft() || name.isLeft()) {
        throw new Error('Icon or name are invalid');
      }

      const category = Category.create({
        icon: icon.value.value,
        name: name.value.value,
      });

      if (category.isLeft()) {
        throw new Error(category.value.message);
      }

      category.value.id = id;

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
}
