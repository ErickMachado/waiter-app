import { Order } from '@/entities';
import { HttpResponse, internalServerError, ok } from '@/presentation/helpers';
import { Handler } from '@/presentation/types/handler';
import { UseCase } from '@/useCases/types/useCase';

export class ListOrdersHandler implements Handler<undefined, Order[] | void> {
  constructor(private readonly useCase: UseCase<undefined, Order[]>) {}

  public async handle(): Promise<HttpResponse<void | Order[]>> {
    try {
      const orders = await this.useCase.execute();

      return ok(orders);
    } catch {
      return internalServerError();
    }
  }
}
