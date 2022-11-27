import { faker } from '@faker-js/faker';
import { Icon } from '@/entities/icon';
import { left, right } from '@/shared';
import { InvalidIconError, InvalidIconLengthError } from '@/entities/errors';

describe('Icon', () => {
  describe('Invalid inputs', () => {
    it('When the provided string is empty, expect that an InvalidIcon error to be returned', () => {
      // Act
      const sut = Icon.parse('');

      // Assert
      expect(sut).toEqual(left(new InvalidIconError()));
    });

    it('When the provided string does not contains any emoji, expect an InvalidIcon error to be returned', () => {
      // Arrange
      const icon = faker.lorem.word();

      // Act
      const sut = Icon.parse(icon);

      // Assert
      expect(sut).toEqual(left(new InvalidIconError()));
    });

    it('When the provided string contains more than 2 emojis, expect an InvalidIconLength error to be returned', () => {
      // Arrange
      const icon = '🙂🔥';

      // Act
      const sut = Icon.parse(icon);

      // Assert
      expect(sut).toEqual(left(new InvalidIconLengthError(icon)));
    });
  });

  describe('Happy path', () => {
    it('When the provided string contains exactly 1 emoji, expect the emoji to be returned', () => {
      // Arrange
      const icon = '🔥';

      // Act
      const sut = Icon.parse(icon);

      // Assert
      expect(sut).toEqual(right({ icon }));
    });
  });
});
