import { Order } from '@/entities';
import { OrderDTO } from '@/presentation/dto/order.dto';
import { MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  HttpError,
  HttpRequest,
  HttpResponse,
  notFound,
  ok,
  unprocessableEntity,
} from '@/presentation/helpers';
import { Handler } from '@/presentation/types/handler';
import { Either } from '@/shared';
import { InvalidOrderStatusError, OrderNotFoundError } from '@/useCases/errors';
import { ChangeOrderStatusPayload } from '@/useCases/order';
import { UseCase } from '@/useCases/types/useCase';

export class ChangeOrderStatusHandler
  implements Handler<ChangeOrderStatusPayload, HttpError | OrderDTO | void>
{
  constructor(
    private readonly useCase: UseCase<
      ChangeOrderStatusPayload,
      Either<InvalidOrderStatusError | OrderNotFoundError, Order>
    >
  ) {}

  public async handle(
    request: HttpRequest<ChangeOrderStatusPayload>
  ): Promise<HttpResponse<HttpError | OrderDTO | void>> {
    if (!request.params?.orderId)
      return badRequest(new MissingParamError('orderId'));

    if (!request.body?.status)
      return badRequest(new MissingParamError('status'));

    const response = await this.useCase.execute({
      orderId: request.params.orderId,
      status: request.body.status,
    });

    if (response.isLeft() && response.value instanceof OrderNotFoundError) {
      return notFound(response.value);
    }

    if (response.isLeft()) return unprocessableEntity(response.value);

    const order = new OrderDTO(response.value);

    return ok(order);
  }
}
