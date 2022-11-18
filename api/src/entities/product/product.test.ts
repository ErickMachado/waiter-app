import { Product } from '@/entities';
import { left } from '@/shared';
import { faker } from '@faker-js/faker';
import { mockProductData } from '@tests/mocks';
import {
  EmptyDescriptionError,
  InvalidDescriptionLengthError,
  InvalidIconError,
  InvalidIconLengthError,
  InvalidNameError,
} from '@/entities/errors';

describe('Product entity', () => {
  it('Should reject product when ingredient icon contains letters', () => {
    // Arrange
    const data = mockProductData({ ingredientIcon: faker.lorem.word() });

    // Act
    const sut = Product.create(data);

    // Assert
    expect(sut).toEqual(left(new InvalidIconError()));
  });

  it('Should reject product when ingredient icon contains more than a single emoji', () => {
    // Arrange
    const icon = '🍕🧀';
    const data = mockProductData({ ingredientIcon: icon });

    // Act
    const sut = Product.create(data);

    // Assert
    expect(sut).toEqual(left(new InvalidIconLengthError(icon)));
  });

  it('Should reject product when ingredient name is empty', () => {
    // Arrange
    const data = mockProductData({ ingredientName: '' });

    // Act
    const sut = Product.create(data);

    // Assert
    expect(sut).toEqual(left(new InvalidNameError('')));
  });

  it('Should reject product when name is empty', () => {
    // Arrange
    const data = mockProductData({ name: '' });

    // Act
    const sut = Product.create(data);

    // Assert
    expect(sut).toEqual(left(new InvalidNameError('')));
  });

  it('Should reject product when description is empty', () => {
    // Arrange
    const data = mockProductData({ description: '' });

    // Act
    const sut = Product.create(data);

    // Assert
    expect(sut).toEqual(left(new EmptyDescriptionError()));
  });

  it('Should reject product when description have more than 255 characters', () => {
    // Arrange
    const data = mockProductData({ description: faker.lorem.words(256) });

    // Act
    const sut = Product.create(data);

    // Assert
    expect(sut).toEqual(left(new InvalidDescriptionLengthError()));
  });
});
