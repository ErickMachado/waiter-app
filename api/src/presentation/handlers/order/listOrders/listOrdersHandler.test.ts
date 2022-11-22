import { ListOrdersHandler } from '@/presentation/handlers/order';

const makeSut = (executeMock = vi.fn()) => {
  const useCase = {
    execute: executeMock,
  };
  const sut = new ListOrdersHandler(useCase);

  return { sut };
};

describe('List orders handler', () => {
  it('Should return ok', async () => {
    // Arrange
    const { sut } = makeSut(vi.fn(() => []));

    // Act
    const { body, statusCode } = await sut.handle();

    // Assert
    expect(statusCode).toBe(200);
    expect(body).toEqual([]);
  });

  it('Should return internal server error', async () => {
    // Arrange
    const { sut } = makeSut(
      vi.fn(() => {
        throw new Error('Test');
      })
    );

    // Act
    const { body, statusCode } = await sut.handle();

    // Assert
    expect(statusCode).toBe(500);
    expect(body).toBeUndefined();
  });
});
