import { Product } from '@/entities';
import {
  HttpError,
  HttpResponse,
  internalServerError,
  ok,
} from '@/presentation/helpers';
import { Handler } from '@/presentation/types/handler';
import { UseCase } from '@/useCases/types/useCase';

export class ListProductsHandler
  implements Handler<undefined, Product[] | HttpError | void>
{
  constructor(private readonly useCase: UseCase<undefined, Product[]>) {}

  public async handle(): Promise<HttpResponse<Product[] | HttpError | void>> {
    try {
      const products = await this.useCase.execute();

      return ok(products);
    } catch (error) {
      return internalServerError();
    }
  }
}
