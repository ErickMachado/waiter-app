export class CategoryNotFoundError extends Error {
  constructor() {
    super('Category does not exists.');

    this.name = 'CategoryNotFoundError';
  }
}
