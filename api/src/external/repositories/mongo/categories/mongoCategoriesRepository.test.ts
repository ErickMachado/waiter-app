import { Category } from '@/entities';
import { CategorySchema } from '@/external/schemas/Category';
import { faker } from '@faker-js/faker';
import cuid from 'cuid';
import { Types } from 'mongoose';
import { MongoCategoriesRepository } from '.';

vi.mock('@/external/schemas/Category');

const makeSut = () => {
  const sut = new MongoCategoriesRepository();

  return { sut };
};

describe('Mongo categories repositories', () => {
  it('Should call schema method to check if document exists', async () => {
    // Arrange
    const spy = vi.spyOn(CategorySchema, 'exists');
    const { sut } = makeSut();
    const name = faker.lorem.word();

    // Act
    await sut.exists(name);

    // Assert
    expect(spy).toHaveBeenCalledWith({ name });
  });

  it('Should return false when a category with provided name does not exists', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const categoryExists = await sut.exists(faker.lorem.word());

    // Assert
    expect(categoryExists).toBe(false);
  });

  it('Should call schema method to check if document exists', async () => {
    // Arrange
    vi.spyOn(CategorySchema, 'exists').mockResolvedValueOnce({
      _id: '' as unknown as Types.ObjectId,
    });
    const { sut } = makeSut();

    // Act
    const categoryExists = await sut.exists(faker.lorem.word());

    // Assert
    expect(categoryExists).toBe(true);
  });

  it('Should throw when category is invalid', async () => {
    // Arrange
    const id = cuid();
    vi.spyOn(CategorySchema, 'find').mockResolvedValueOnce([
      {
        _id: '' as unknown as Types.ObjectId,
        id,
        icon: '🍕🍕',
        name: faker.lorem.word(),
      },
    ]);
    const { sut } = makeSut();

    // Act & Assert
    await expect(sut.listAll()).rejects.toThrow(
      `Category with id ${id} is invalid`
    );
  });

  it('Should return an array of categories', async () => {
    // Arrange
    vi.spyOn(CategorySchema, 'find').mockResolvedValueOnce([
      {
        _id: '' as unknown as Types.ObjectId,
        icon: '🍕',
        name: faker.lorem.word(),
      },
    ]);
    const { sut } = makeSut();

    // Act
    const categories = await sut.listAll();

    // Assert
    expect(categories[0]).toBeInstanceOf(Category);
  });

  it('Should return undefined when category does not exists', async () => {
    // Arrange
    vi.spyOn(CategorySchema, 'findOne').mockImplementationOnce(() => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      where: () => null,
    }));
    const { sut } = makeSut();

    // Act
    const category = await sut.findById(cuid());

    // Assert
    expect(category).toBeUndefined();
  });

  it('Should throw when category is invalid', async () => {
    // Arrange
    const id = cuid();
    vi.spyOn(CategorySchema, 'findOne').mockImplementationOnce(() => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      where: () => ({
        id,
        icon: '🍕🍕',
        name: faker.lorem.word(),
      }),
    }));
    const { sut } = makeSut();

    // Act & Assert
    await expect(sut.findById(id)).rejects.toThrow(
      `Category with id ${id} is invalid`
    );
  });

  it('Should return an instance of Category', async () => {
    // Arrange
    const id = cuid();
    vi.spyOn(CategorySchema, 'findOne').mockImplementationOnce(() => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      where: () => ({
        id,
        icon: '🍕',
        name: faker.lorem.word(),
      }),
    }));
    const { sut } = makeSut();

    // Act
    const category = await sut.findById(id);

    // Act & Assert
    expect(category).toBeInstanceOf(Category);
  });
});
