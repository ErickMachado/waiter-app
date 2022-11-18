import cuid from 'cuid';
import { Category, Description, Icon, Name } from '@/entities';
import { Either, left, right } from '@/shared';
import {
  EmptyDescriptionError,
  InvalidDescriptionLengthError,
  InvalidIconError,
  InvalidIconLengthError,
  InvalidNameError,
} from '@/entities/errors';

export interface ParsedIngredient {
  icon: Icon;
  name: Name;
}

export interface Ingredient {
  icon: string;
  name: string;
}

export interface ProductData {
  categoryId: string;
  description: string;
  ingredients?: Ingredient[];
  imageName: string;
  name: string;
  price: number;
}

export class Product {
  public category?: Category;
  public id: string;

  private constructor(
    readonly categoryId: string,
    readonly description: Description,
    readonly ingredients: ParsedIngredient[],
    readonly imageName: string,
    readonly name: Name,
    readonly price: number,
    id?: string
  ) {
    this.id = id || cuid();
  }

  public static create(
    data: ProductData,
    id?: string
  ): Either<
    | EmptyDescriptionError
    | InvalidDescriptionLengthError
    | InvalidIconError
    | InvalidIconLengthError
    | InvalidNameError,
    Product
  > {
    const descriptionOrError = Description.parse(data.description);
    const nameOrError = Name.parse(data.name);
    const ingredients: ParsedIngredient[] = [];

    if (data.ingredients) {
      for (const ingredient of data.ingredients) {
        const iconOrError = Icon.parse(ingredient.icon);
        const nameOrError = Name.parse(ingredient.name);

        if (iconOrError.isLeft()) return left(iconOrError.value);
        if (nameOrError.isLeft()) return left(nameOrError.value);

        const icon = iconOrError.value;
        const name = nameOrError.value;

        ingredients.push({ icon, name });
      }
    }

    if (descriptionOrError.isLeft()) return left(descriptionOrError.value);
    if (nameOrError.isLeft()) return left(nameOrError.value);

    const description = descriptionOrError.value;
    const name = nameOrError.value;

    return right(
      new Product(
        data.categoryId,
        description,
        ingredients,
        data.imageName,
        name,
        data.price,
        id
      )
    );
  }
}
