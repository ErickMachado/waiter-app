import { Category } from '@/entities';

export class CategoryDTO {
  public icon: string;
  public id: string;
  public name: string;

  constructor(category: Category) {
    this.icon = category.icon.value;
    this.id = category.id;
    this.name = category.name.value;
  }
}
