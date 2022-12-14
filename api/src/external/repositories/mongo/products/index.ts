import { Ingredient, Product } from '@/entities';
import { ProductSchema } from '@/external/schemas/Product';
import { ProductsRepository } from '@/useCases/ports';

export class MongoProductsRepository implements ProductsRepository {
  public async listAll(): Promise<Product[]> {
    const documents = await ProductSchema.find();

    if (!documents?.length) return [];

    return documents.map((document) => {
      const product = Product.create(
        {
          categoryId: document.categoryId,
          description: document.description,
          imageName: document.imagePath,
          name: document.name,
          price: Number(document.price),
          ingredients: document.ingredients as Ingredient[],
        },
        document.id
      );

      if (product.isLeft()) {
        throw new Error('Invalid category');
      }

      return product.value;
    });
  }

  public async listAllByCategoryId(categoryId: string): Promise<Product[]> {
    const documents = await ProductSchema.find({ categoryId });

    if (!documents?.length) return [];

    return documents.map((document) => {
      const product = Product.create(
        {
          categoryId: document.categoryId,
          description: document.description,
          imageName: document.imagePath,
          name: document.name,
          price: Number(document.price),
          ingredients: document.ingredients as Ingredient[],
        },
        document.id
      );

      if (product.isLeft()) {
        throw new Error('Invalid category');
      }

      return product.value;
    });
  }

  public async save(product: Product): Promise<void> {
    await ProductSchema.create({
      categoryId: product.categoryId,
      description: product.description.value,
      imagePath: product.imageName,
      id: product.id,
      ingredients: product.ingredients?.map((ingredient) => ({
        icon: ingredient.icon.value,
        name: ingredient.name.value,
      })),
      name: product.name.value,
      price: product.price,
    });
  }

  public async findById(productId: string): Promise<Product | undefined> {
    const document = await ProductSchema.findOne({ id: productId });

    if (!document) return undefined;

    const product = Product.create(
      {
        categoryId: document.categoryId,
        description: document.description,
        imageName: document.imagePath,
        name: document.name,
        price: Number(document.price),
        ingredients: document.ingredients as Ingredient[],
      },
      document.id
    );

    if (product.isLeft()) {
      throw new Error('Invalid category');
    }

    return product.value;
  }

  public async exists(productId: string): Promise<boolean> {
    const document = await ProductSchema.exists({ id: productId });

    if (!document) return false;

    return true;
  }
}
