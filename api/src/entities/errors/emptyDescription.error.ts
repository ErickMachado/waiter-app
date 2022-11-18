export class EmptyDescriptionError extends Error {
  constructor() {
    super(
      'Description cannot be empty. It should be greater than 0 characters and less than 255.'
    );

    this.name = 'EmptyDescriptionError';
  }
}
