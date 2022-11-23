export class OrderNotFoundError extends Error {
  constructor() {
    super('Order does not exists.');

    this.name = 'OrderNotFoundError';
  }
}
