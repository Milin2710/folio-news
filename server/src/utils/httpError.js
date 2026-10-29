export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message = "Bad request") => new HttpError(400, message);
export const unauthorized = (message = "Please log in") => new HttpError(401, message);
export const notFound = (message = "Not found") => new HttpError(404, message);
