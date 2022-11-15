import { faker } from '@faker-js/faker';
import { left } from '@/shared';
import { Name } from '@/entities';
import { InvalidNameError } from '@/entities/errors';

describe('Name', () => {
  it('Should reject empty names', () => {
    // Arrange
    const name = '';

    // Act
    const sut = Name.parse(name);

    // Assert
    expect(sut.isLeft()).toBe(true);
    expect(sut).toEqual(left(new InvalidNameError(name)));
  });

  it('Should accept non empty names', () => {
    // Arrange
    const name = faker.lorem.word();

    // Act
    const sut = Name.parse(name);

    // Assert
    expect(sut.isRight()).toBe(true);
    expect(sut).toEqual({ value: { name } });
  });

  it('Should return provided name when property value is accessed', () => {
    // Arrange
    const name = faker.lorem.word();

    // Act
    const sut = Name.parse(name);

    // Assert
    expect(sut.isRight() && sut.value.value).toEqual(name);
  });
});
