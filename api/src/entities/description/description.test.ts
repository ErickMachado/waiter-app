import { Description } from '@/entities';
import { left, right } from '@/shared';
import {
  EmptyDescriptionError,
  InvalidDescriptionLengthError,
} from '@/entities/errors';
import { faker } from '@faker-js/faker';

describe('Description', () => {
  describe('Invalid inputs', () => {
    it('When the provided string have more than 255 characters, expect it to return an InvalidDescriptionLength error', () => {
      // Arrange
      const description = faker.lorem.words(256);

      // Act
      const sut = Description.parse(description);

      // Assert
      expect(sut).toEqual(left(new InvalidDescriptionLengthError()));
    });

    it('When the provided string is empty, expect it to return an EmptyDescription error', () => {
      // Arrange
      const description = '';

      // Act
      const sut = Description.parse(description);

      // Assert
      expect(sut).toEqual(left(new EmptyDescriptionError()));
    });
  });

  describe('Happy path', () => {
    it('When the property "value" is accessed, expect it to return the description', () => {
      // Arrange
      const description = faker.lorem.words();

      // Act
      const sut = Description.parse(description);

      // Assert
      expect(sut.isRight() && sut.value.value).toBe(description);
    });

    it('When the provided string matches the requirements, expect the description to be returned', () => {
      // Arrange
      const description = faker.lorem.words();

      // Act
      const sut = Description.parse(description);

      // Assert
      expect(sut).toEqual(right({ description }));
    });
  });
});
