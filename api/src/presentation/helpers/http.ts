export interface HttpRequest<B> {
  body?: B;
}

export interface HttpResponse<B> {
  body?: B;
  statusCode: number;
}

export interface HttpError {
  error: string;
  help?: string;
  type: string;
}

function buildError(error: Error): HttpError {
  return {
    error: error.message,
    type: error.name,
  };
}

export function badRequest(error: Error): HttpResponse<HttpError> {
  return {
    body: buildError(error),
    statusCode: 400,
  };
}

export function created<B>(body?: B): HttpResponse<B> {
  return {
    body,
    statusCode: 201,
  };
}

export function conflict(error: Error): HttpResponse<HttpError> {
  return {
    body: buildError(error),
    statusCode: 409,
  };
}

export function internalServerError(): HttpResponse<void> {
  return {
    statusCode: 500,
  };
}

export function notFound(error: Error): HttpResponse<HttpError> {
  return {
    body: buildError(error),
    statusCode: 404,
  };
}

export function ok<B>(body?: B): HttpResponse<B> {
  return {
    body,
    statusCode: 200,
  };
}

export function unprocessableEntity(error: Error): HttpResponse<HttpError> {
  return {
    body: buildError(error),
    statusCode: 422,
  };
}
