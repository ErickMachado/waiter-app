import { Description } from '@/entities';
import { left, right } from '@/shared';
import {
  EmptyDescriptionError,
  InvalidDescriptionLengthError,
} from '@/entities/errors';
import { faker } from '@faker-js/faker';

describe('Description entity', () => {
  it('Should reject descriptions greater than 255 characters', () => {
    // Arrange
    const description = faker.lorem.words(256);

    // Act
    const sut = Description.parse(description);

    // Assert
    expect(sut).toEqual(left(new InvalidDescriptionLengthError()));
  });

  it('Should reject empty descriptions', () => {
    // Arrange
    const description = '';

    // Act
    const sut = Description.parse(description);

    // Assert
    expect(sut).toEqual(left(new EmptyDescriptionError()));
  });

  it('Should create description', () => {
    // Arrange
    const description = faker.lorem.words();

    // Act
    const sut = Description.parse(description);

    // Assert
    expect(sut).toEqual(right({ description }));
  });
});
