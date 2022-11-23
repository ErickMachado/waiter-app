import { Order } from '@/entities';
import { OrderDTO } from '@/presentation/dto/order.dto';
import { HttpResponse, internalServerError, ok } from '@/presentation/helpers';
import { Handler } from '@/presentation/types/handler';
import { UseCase } from '@/useCases/types/useCase';

export class ListOrdersHandler
  implements Handler<undefined, OrderDTO[] | void>
{
  constructor(private readonly useCase: UseCase<undefined, Order[]>) {}

  public async handle(): Promise<HttpResponse<void | OrderDTO[]>> {
    try {
      const orders = await this.useCase.execute();

      return ok(orders.map((order) => new OrderDTO(order)));
    } catch {
      return internalServerError();
    }
  }
}
