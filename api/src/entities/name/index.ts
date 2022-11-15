import { Either, left, right } from '@/shared';
import { InvalidNameError } from '@/entities/errors';

export class Name {
  private constructor(private readonly name: string) {}

  public get value(): string {
    return this.name;
  }

  public static parse(name: string): Either<InvalidNameError, Name> {
    if (!name.trim()) return left(new InvalidNameError(name));

    return right(new Name(name));
  }
}
