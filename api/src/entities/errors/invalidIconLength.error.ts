export class InvalidIconLengthError extends Error {
  constructor(icon: string) {
    super(`Icon should be a single emoji. Received ${icon} instead`);

    this.name = 'InvalidIconLength';
  }
}
