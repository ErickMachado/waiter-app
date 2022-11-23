export class InvalidOrderStatusError extends Error {
  constructor() {
    super('Status is not valid.');

    this.name = 'InvalidOrderStatusError';
  }
}
