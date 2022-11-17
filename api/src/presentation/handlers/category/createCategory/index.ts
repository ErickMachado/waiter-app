import { CategoryData } from '@/entities';
import { CategoryDTO } from '@/presentation/dto';
import { MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  conflict,
  created,
  HttpError,
  HttpRequest,
  HttpResponse,
  internalServerError,
  unprocessableEntity,
} from '@/presentation/helpers';
import { CreateCategoryUseCase } from '@/useCases/category';
import { CategoryConflictError } from '@/useCases/errors';

export class CreateCategoryHandler {
  constructor(private readonly useCase: CreateCategoryUseCase) {}

  public async handle(
    request: HttpRequest<CategoryData>
  ): Promise<HttpResponse<CategoryDTO | HttpError | void>> {
    if (!request.body?.name) {
      return badRequest(new MissingParamError('name'));
    }

    if (!request.body?.icon) {
      return badRequest(new MissingParamError('icon'));
    }

    try {
      const category = await this.useCase.execute(request.body);

      if (
        category.isLeft() &&
        category.value instanceof CategoryConflictError
      ) {
        return conflict(category.value);
      }
      if (category.isLeft()) return unprocessableEntity(category.value);

      return created<CategoryDTO>(new CategoryDTO(category.value));
    } catch {
      return internalServerError();
    }
  }
}
