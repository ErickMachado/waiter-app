export class InvalidIconError extends Error {
  constructor() {
    super(
      'Icon must be an emoji character. Try to send a single emoji character.'
    );

    this.name = 'InvalidIconError';
  }
}
