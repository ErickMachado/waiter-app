import { CategoryDTO } from '@/presentation/dto';
import { HttpResponse, internalServerError, ok } from '@/presentation/helpers';
import { ListCategoriesUseCase } from '@/useCases/category';

export class ListCategoriesHandler {
  constructor(private readonly useCase: ListCategoriesUseCase) {}

  public async handle(): Promise<HttpResponse<CategoryDTO[] | void>> {
    try {
      const categories = await this.useCase.execute();

      return ok<CategoryDTO[]>(
        categories.map((category) => new CategoryDTO(category))
      );
    } catch (error) {
      return internalServerError();
    }
  }
}
