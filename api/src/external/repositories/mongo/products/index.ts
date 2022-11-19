import { Product } from '@/entities';
import { ProductSchema } from '@/external/schemas/Product';
import { ProductsRepository } from '@/useCases/ports';

export class MongoProductsRepository implements ProductsRepository {
  public async save(product: Product): Promise<void> {
    await ProductSchema.create({
      categoryId: product.categoryId,
      description: product.description.value,
      imagePath: product.imageName,
      ingredients: product.ingredients?.map((ingredient) => ({
        icon: ingredient.icon.value,
        name: ingredient.name.value,
      })),
      name: product.name.value,
      price: product.price,
    });
  }
}
