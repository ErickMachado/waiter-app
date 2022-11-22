import { Order, OrderData } from '@/entities';
import { MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  created,
  HttpError,
  HttpRequest,
  HttpResponse,
  internalServerError,
  notFound,
} from '@/presentation/helpers';
import { Handler } from '@/presentation/types/handler';
import { Either } from '@/shared';
import { ProductNotFoundError } from '@/useCases/errors';
import { UseCase } from '@/useCases/types/useCase';

export class CreateOrderHandler
  implements Handler<OrderData, Order | HttpError | void>
{
  constructor(
    private readonly useCase: UseCase<
      OrderData,
      Either<ProductNotFoundError, Order>
    >
  ) {}

  public async handle(
    request: HttpRequest<OrderData>
  ): Promise<HttpResponse<Order | HttpError | void>> {
    if (!request.body?.table) return badRequest(new MissingParamError('table'));
    if (!request.body?.items || !request.body?.items.length)
      return badRequest(new MissingParamError('items'));

    try {
      const order = await this.useCase.execute(request.body);

      if (order.isLeft()) return notFound(order.value);

      return created(order.value);
    } catch {
      return internalServerError();
    }
  }
}
