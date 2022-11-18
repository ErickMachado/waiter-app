export class InvalidDescriptionLengthError extends Error {
  constructor() {
    super('Max description length is 255 characters.');

    this.name = 'InvalidDescriptionLengthError';
  }
}
