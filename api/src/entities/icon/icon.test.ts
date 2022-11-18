import { faker } from '@faker-js/faker';
import { Icon } from '@/entities/icon';
import { left } from '@/shared';
import { InvalidIconError, InvalidIconLengthError } from '@/entities/errors';

describe('Icon', () => {
  it('Should reject strings that does not contains emojis', () => {
    // Arrange
    const icon = faker.lorem.word();

    // Act
    const sut = Icon.parse(icon);

    // Assert
    expect(sut).toEqual(left(new InvalidIconError()));
  });

  it('Should reject strings that contains more than one emoji', () => {
    // Arrange
    const icon = '🙂🔥';

    // Act
    const sut = Icon.parse(icon);

    // Assert
    expect(sut).toEqual(left(new InvalidIconLengthError(icon)));
  });

  it('Should accept strings that contains exact one emoji', () => {
    // Arrange
    const icon = '🔥';

    // Act
    const sut = Icon.parse(icon);

    // Assert
    expect(sut).toEqual({ value: { icon } });
  });
});
