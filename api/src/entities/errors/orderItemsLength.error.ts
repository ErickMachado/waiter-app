export class OrderItemsLengthError extends Error {
  constructor() {
    super('Only 10 items is available per order.');

    this.name = 'OrderItemsLengthError';
  }
}
