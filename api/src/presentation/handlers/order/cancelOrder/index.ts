import { MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  HttpError,
  HttpRequest,
  HttpResponse,
  internalServerError,
  noContent,
  notFound,
} from '@/presentation/helpers';
import { Handler } from '@/presentation/types/handler';
import { Either } from '@/shared';
import { OrderNotFoundError } from '@/useCases/errors';
import { UseCase } from '@/useCases/types/useCase';

export class CancelOrderHandler
  implements Handler<{ orderId: string }, HttpError | void>
{
  constructor(
    private readonly useCase: UseCase<
      string,
      Either<OrderNotFoundError, string>
    >
  ) {}

  public async handle(
    request: HttpRequest<{ orderId: string }>
  ): Promise<HttpResponse<HttpError | void>> {
    if (!request.body?.orderId)
      return badRequest(new MissingParamError('orderId'));

    try {
      const response = await this.useCase.execute(request.body.orderId);

      if (response.isLeft()) return notFound(response.value);

      return noContent();
    } catch {
      return internalServerError();
    }
  }
}
