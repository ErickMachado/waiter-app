import { Either, left, right } from '@/shared';
import { InvalidIconError, InvalidIconLengthError } from '@/entities/errors';

export class Icon {
  private constructor(private readonly icon: string) {}

  public get value(): string {
    return this.icon;
  }

  public static parse(
    text: string
  ): Either<InvalidIconError | InvalidIconLengthError, Icon> {
    const emojiRegex = /[\p{Emoji}\u200d]+/gu;
    const icon = text.match(emojiRegex);

    if (!text) return left(new InvalidIconError(text));
    if (!icon) return left(new InvalidIconError(text));
    if (icon.toString().length > 2) {
      return left(new InvalidIconLengthError(icon.toString()));
    }

    return right(new Icon(text));
  }
}
