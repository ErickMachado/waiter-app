import { Product } from '@/entities';
import {
  HttpError,
  HttpRequest,
  HttpResponse,
  internalServerError,
  notFound,
  ok,
} from '@/presentation/helpers';
import { Handler } from '@/presentation/types/handler';
import { Either } from '@/shared';
import { CategoryNotFoundError } from '@/useCases/errors';
import { UseCase } from '@/useCases/types/useCase';

export class ListProductsByCategoryHandler
  implements Handler<undefined, Product[] | HttpError | void>
{
  constructor(
    private readonly useCase: UseCase<
      string,
      Either<CategoryNotFoundError, Product[]>
    >
  ) {}

  public async handle(
    request: HttpRequest<undefined>
  ): Promise<HttpResponse<Product[] | HttpError | void>> {
    const categoryId = request.params?.categoryId;

    try {
      const response = await this.useCase.execute(categoryId);

      if (response.isLeft()) return notFound(response.value);

      return ok(response.value);
    } catch {
      return internalServerError();
    }
  }
}
