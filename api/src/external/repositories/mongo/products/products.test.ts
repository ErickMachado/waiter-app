import { ProductSchema } from '@/external/schemas/Product';
import { MongoProductsRepository } from '@/external/repositories/mongo/products';
import { Product } from '@/entities';
import { mockProductData } from '@tests/mocks';
import { faker } from '@faker-js/faker';

vi.mock('@/external/schemas/Product');

describe('Mongo products repository', () => {
  it('Should call schema create method to create a new product', async () => {
    // Arrange
    const spy = vi.spyOn(ProductSchema, 'create');
    const sut = new MongoProductsRepository();
    const product = Product.create(mockProductData());

    if (product.isLeft()) {
      throw new Error('Invalid product');
    }

    // Act
    await sut.save(product.value);

    // Assert
    expect(spy).toHaveBeenCalled();
  });

  it('Should call schema find method to list products', async () => {
    // Arrange
    const spy = vi.spyOn(ProductSchema, 'find');
    const sut = new MongoProductsRepository();
    const product = Product.create(mockProductData());

    if (product.isLeft()) {
      throw new Error('Invalid product');
    }

    // Act
    await sut.listAll();

    // Assert
    expect(spy).toHaveBeenCalled();
  });

  it('Should return empty array when there is no products', async () => {
    // Arrange
    const sut = new MongoProductsRepository();
    const product = Product.create(mockProductData());

    if (product.isLeft()) {
      throw new Error('Invalid product');
    }

    // Act
    const products = await sut.listAll();

    // Assert
    expect(products).toEqual([]);
  });

  it('Should return instances of product entity when products exists', async () => {
    // Arrange
    vi.spyOn(ProductSchema, 'find').mockResolvedValueOnce([
      {
        _id: faker.datatype.uuid(),
        id: faker.datatype.uuid(),
        name: faker.lorem.word(),
        description: faker.lorem.words(),
        ingredients: [{ icon: '🧀', name: faker.lorem.word() }],
        price: faker.datatype.number(),
      },
    ]);
    const sut = new MongoProductsRepository();

    // Act
    const products = await sut.listAll();

    // Assert
    for (const product of products) {
      expect(product).toBeInstanceOf(Product);
    }
  });

  it('Should throw when data returned has invalid values', async () => {
    // Arrange
    vi.spyOn(ProductSchema, 'find').mockResolvedValueOnce([
      {
        _id: faker.datatype.uuid(),
        id: faker.datatype.uuid(),
        name: faker.lorem.word(),
        description: faker.lorem.words(),
        ingredients: [{ icon: '🧀🧀', name: faker.lorem.word() }],
        price: faker.datatype.number(),
      },
    ]);
    const sut = new MongoProductsRepository();

    // Act
    const products = sut.listAll();

    // Assert
    expect(products).rejects.toThrow();
  });

  it('Should return instances of product entity when products exists', async () => {
    // Arrange
    vi.spyOn(ProductSchema, 'find').mockResolvedValueOnce([
      {
        _id: faker.datatype.uuid(),
        id: faker.datatype.uuid(),
        name: faker.lorem.word(),
        description: faker.lorem.words(),
        ingredients: [{ icon: '🧀', name: faker.lorem.word() }],
        price: faker.datatype.number(),
      },
    ]);
    const sut = new MongoProductsRepository();

    // Act
    const products = await sut.listAllByCategoryId(faker.datatype.uuid());

    // Assert
    for (const product of products) {
      expect(product).toBeInstanceOf(Product);
    }
  });

  it('Should throw when data returned has invalid values', async () => {
    // Arrange
    vi.spyOn(ProductSchema, 'find').mockResolvedValueOnce([
      {
        _id: faker.datatype.uuid(),
        id: faker.datatype.uuid(),
        name: faker.lorem.word(),
        description: faker.lorem.words(),
        ingredients: [{ icon: '🧀🧀', name: faker.lorem.word() }],
        price: faker.datatype.number(),
      },
    ]);
    const sut = new MongoProductsRepository();

    // Act
    const products = sut.listAllByCategoryId(faker.datatype.uuid());

    // Assert
    expect(products).rejects.toThrow();
  });

  it('Should return empty array when there is no products', async () => {
    // Arrange
    const sut = new MongoProductsRepository();
    const product = Product.create(mockProductData());

    if (product.isLeft()) {
      throw new Error('Invalid product');
    }

    // Act
    const products = await sut.listAllByCategoryId(faker.datatype.uuid());

    // Assert
    expect(products).toEqual([]);
  });
});
