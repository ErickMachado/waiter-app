import cuid from 'cuid';
import { Icon, Name } from '@/entities';
import { Either, left, right } from '@/shared';
import {
  InvalidNameError,
  InvalidIconError,
  InvalidIconLengthError,
} from '@/entities/errors';

type CategoryEntityResponse = Either<
  InvalidNameError | InvalidIconError | InvalidIconLengthError,
  Category
>;

export interface CategoryData {
  icon: string;
  name: string;
}

export class Category {
  public id: string;

  private constructor(readonly icon: Icon, readonly name: Name, id?: string) {
    this.id = id || cuid();
  }

  public static create(
    data: CategoryData,
    id?: string
  ): CategoryEntityResponse {
    const nameOrError = Name.parse(data.name);
    const iconOrError = Icon.parse(data.icon);

    if (nameOrError.isLeft()) return left(nameOrError.value);
    if (iconOrError.isLeft()) return left(iconOrError.value);

    const name = nameOrError.value;
    const icon = iconOrError.value;

    return right(new Category(icon, name, id));
  }
}
