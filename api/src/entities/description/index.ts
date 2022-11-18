import { Either, left, right } from '@/shared';
import {
  InvalidDescriptionLengthError,
  EmptyDescriptionError,
} from '@/entities/errors';

export class Description {
  private constructor(private readonly description: string) {}

  get value(): string {
    return this.description;
  }

  public static parse(
    description: string
  ): Either<
    InvalidDescriptionLengthError | EmptyDescriptionError,
    Description
  > {
    if (description.length > 255)
      return left(new InvalidDescriptionLengthError());
    if (description.length === 0) return left(new EmptyDescriptionError());

    return right(new Description(description));
  }
}
