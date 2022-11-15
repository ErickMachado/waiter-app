export class InvalidNameError extends Error {
  constructor(name: string) {
    super(`${name} cannot be empty`);

    this.name = 'InvalidNameError';
  }
}
