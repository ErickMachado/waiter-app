export class InvalidIconError extends Error {
  constructor(icon: string) {
    super(`${icon} must be an emoji character`);

    this.name = 'InvalidIconError';
  }
}
