import { ProductData } from '@/entities';
import { ProductDTO } from '@/presentation/dto';
import { MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  created,
  HttpError,
  HttpRequest,
  HttpResponse,
  internalServerError,
  notFound,
  unprocessableEntity,
} from '@/presentation/helpers';
import { Handler } from '@/presentation/types/handler';
import { CategoryNotFoundError } from '@/useCases/errors';
import { CreateProductResponse } from '@/useCases/product';
import { UseCase } from '@/useCases/types/useCase';

export class CreateProductHandler
  implements Handler<ProductData, ProductDTO | HttpError | void>
{
  constructor(
    private readonly useCase: UseCase<ProductData, CreateProductResponse>
  ) {}

  public async handle(
    request: HttpRequest<ProductData>
  ): Promise<HttpResponse<ProductDTO | HttpError | void>> {
    if (!request.body?.categoryId) {
      return badRequest(new MissingParamError('categoryId'));
    }
    if (!request.body?.description) {
      return badRequest(new MissingParamError('description'));
    }
    if (!request.body?.imageName) {
      return badRequest(new MissingParamError('imageName'));
    }
    if (!request.body?.name) {
      return badRequest(new MissingParamError('name'));
    }
    if (!request.body?.price) {
      return badRequest(new MissingParamError('price'));
    }

    try {
      const product = await this.useCase.execute(request.body);

      if (product.isLeft() && product.value instanceof CategoryNotFoundError)
        return notFound(product.value);
      if (product.isLeft()) return unprocessableEntity(product.value);

      return created<ProductDTO>(new ProductDTO(product.value));
    } catch (error) {
      console.error(error);

      return internalServerError();
    }
  }
}
