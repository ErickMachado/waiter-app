import { ProductSchema } from '@/external/schemas/Product';
import { MongoProductsRepository } from '@/external/repositories/mongo/products';
import { Product } from '@/entities';
import { mockProductData } from '@tests/mocks';
import { faker } from '@faker-js/faker';
import cuid from 'cuid';
import { Types } from 'mongoose';

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

  it('Should call schema exists method', async () => {
    // Arrange
    const sut = new MongoProductsRepository();
    const spy = vi.spyOn(ProductSchema, 'exists');
    const id = cuid();

    // Act
    await sut.exists(id);

    // Assert
    expect(spy).toHaveBeenCalledWith({ id });
  });

  it('Should return false when document does not exists', async () => {
    // Arrange
    const sut = new MongoProductsRepository();
    vi.spyOn(ProductSchema, 'exists').mockResolvedValueOnce(null);
    const id = cuid();

    // Act
    const response = await sut.exists(id);

    // Assert
    expect(response).toBe(false);
  });

  it('Should return true when document exists', async () => {
    // Arrange
    const sut = new MongoProductsRepository();
    vi.spyOn(ProductSchema, 'exists').mockResolvedValueOnce({
      _id: '' as unknown as Types.ObjectId,
    });
    const id = cuid();

    // Act
    const response = await sut.exists(id);

    // Assert
    expect(response).toBe(true);
  });

  it('Should return undefined when document does not exists', async () => {
    // Arrange
    const sut = new MongoProductsRepository();
    vi.spyOn(ProductSchema, 'findOne').mockResolvedValueOnce(null);
    const id = cuid();

    // Act
    const response = await sut.findById(id);

    // Assert
    expect(response).toBeUndefined();
  });

  it('Should return throw when product format is incorrect', async () => {
    // Arrange
    const sut = new MongoProductsRepository();
    vi.spyOn(ProductSchema, 'findOne').mockResolvedValueOnce({
      categoryId: cuid(),
      description: faker.lorem.words(),
      imageName: faker.system.fileName(),
      name: faker.lorem.word(),
      price: faker.datatype.number(),
      ingredients: [{ icon: '🍔🧀', name: faker.lorem.word() }],
    });
    const id = cuid();

    // Act & Assert
    await expect(sut.findById(id)).rejects.toThrow();
  });

  it('Should return an instance of Product', async () => {
    // Arrange
    const sut = new MongoProductsRepository();
    vi.spyOn(ProductSchema, 'findOne').mockResolvedValueOnce({
      categoryId: cuid(),
      description: faker.lorem.words(),
      imageName: faker.system.fileName(),
      name: faker.lorem.word(),
      price: faker.datatype.number(),
      ingredients: [{ icon: '🧀', name: faker.lorem.word() }],
    });

    // Act
    const response = await sut.findById(cuid());

    // Assert
    expect(response).toBeInstanceOf(Product);
  });
});
