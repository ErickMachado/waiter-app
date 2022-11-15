import { isCuid } from 'cuid';
import { faker } from '@faker-js/faker';
import { Category, Icon, Name } from '@/entities';
import { left } from '@/shared';
import {
  InvalidIconError,
  InvalidIconLengthError,
  InvalidNameError,
} from '@/entities/errors';
import { mockCategoryData } from '@tests/mocks';

describe('Category', () => {
  it('Should return InvalidNameError when name is empty', () => {
    // Arrange
    const dataMock = mockCategoryData({ name: '' });

    // Act
    const sut = Category.create(dataMock);

    // Assert
    expect(sut).toEqual(left(new InvalidNameError(dataMock.name)));
  });

  it('Should return InvalidIconError when icon is not an emoji', () => {
    // Arrange
    const dataMock = mockCategoryData({ icon: faker.lorem.word() });

    // Act
    const sut = Category.create(dataMock);

    // Assert
    expect(sut).toEqual(left(new InvalidIconError(dataMock.icon)));
  });

  it('Should return InvalidIconLengthError when icon is an emoji but length is grater than 1', () => {
    // Arrange
    const dataMock = mockCategoryData({ icon: '🔥🤞' });

    // Act
    const sut = Category.create(dataMock);

    // Assert
    expect(sut).toEqual(left(new InvalidIconLengthError(dataMock.icon)));
  });

  it('Should generate an ID of type cuid for the new category', () => {
    // Arrange
    const dataMock = mockCategoryData();

    // Act
    const sut = Category.create(dataMock);

    // Assert
    expect(sut.isRight() && isCuid(sut.value.id)).toBe(true);
  });

  it('Should create a new category', () => {
    // Arrange
    const dataMock = mockCategoryData();

    // Act
    const sut = Category.create(dataMock);

    // Assert
    expect(sut.isRight() && sut.value.icon).toBeInstanceOf(Icon);
    expect(sut.isRight() && sut.value.name).toBeInstanceOf(Name);
  });
});
