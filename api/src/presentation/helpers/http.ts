export interface HttpRequest<B> {
  body?: B;
}

export interface HttpResponse<B> {
  body?: B;
  statusCode: number;
}

export function badRequest(body: Error): HttpResponse<Error> {
  return {
    body,
    statusCode: 400,
  };
}

export function created<B>(body?: B): HttpResponse<B> {
  return {
    body,
    statusCode: 201,
  };
}

export function conflict(body: Error): HttpResponse<Error> {
  return {
    body,
    statusCode: 409,
  };
}

export function internalServerError(): HttpResponse<void> {
  return {
    statusCode: 500,
  };
}

export function ok<B>(body?: B): HttpResponse<B> {
  return {
    body,
    statusCode: 200,
  };
}

export function unprocessableEntity(body: Error): HttpResponse<Error> {
  return {
    body,
    statusCode: 429,
  };
}
