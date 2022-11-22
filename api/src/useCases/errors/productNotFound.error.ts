export class ProductNotFoundError extends Error {
  constructor() {
    super('Product does not exists.');

    this.name = 'ProductNotFoundError';
  }
}
