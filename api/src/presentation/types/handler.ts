import { HttpRequest, HttpResponse } from '@/presentation/helpers';

export interface Handler<P, R> {
  handle(request?: HttpRequest<P>): Promise<HttpResponse<R>>;
}
