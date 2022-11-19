import { Category, Ingredient, Product } from '@/entities';

export class ProductDTO {
  public readonly category?: Category;
  public readonly categoryId: string;
  public readonly id: string;
  public readonly ingredients?: Ingredient[] = [];
  public readonly name: string;
  public readonly icon: string;

  constructor(product: Product) {
    this.category = product.category;
    this.categoryId = product.categoryId;
    this.id = product.id;
    this.ingredients = product.ingredients?.map((ingredient) => ({
      icon: ingredient.icon.value,
      name: ingredient.name.value,
    }));
    this.name = product.name.value;
    this.icon = product.description.value;
  }
}
