export class CategoryConflictError extends Error {
  constructor(category: string) {
    super(
      `A category name ${category} already exists. Try register with a different name`
    );

    this.name = 'CategoryConflictError';
  }
}
