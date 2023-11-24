import { uid } from "uid/secure";
import { HTTPError } from "./error";

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_UID_LENGTH = 16;

export const BEARER_REGEXP = /^bearer\s(?<token>[^\s]+)$/i;

export const getId = () => uid(DEFAULT_UID_LENGTH);

export const parsePaginationParams = (request: Request) => {
  const params = new URL(request.url).searchParams;
  const parsedPage = parseInt(params.get("page") ?? "", 10);
  const parsedSize = parseInt(params.get("size") ?? "", 10);

  const page = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 0;
  const size =
    !isNaN(parsedSize) && parsedSize > 0 ? parsedSize : DEFAULT_PAGE_SIZE;
  const offset = (page > 0 ? page - 1 : 0) * size;

  return [size, offset];
};

export const parseDateParams = (request: Request) => {
  const params = new URL(request.url).searchParams;

  const parsedFrom = Date.parse(params.get("from") ?? "");
  const parsedTo = Date.parse(params.get("to") ?? "");

  const from = !isNaN(parsedFrom) ? new Date(parsedFrom).toISOString() : null;
  const to = !isNaN(parsedTo) ? new Date(parsedTo).toISOString() : null;

  return [from, to];
};

export const parseBearerToken = (request: Request) => {
  const bearer = request.headers.get("authorization");

  if (!bearer?.length) {
    throw new HTTPError("Unauthorized", 401, { "www-authenticate": "Bearer" });
  }
  const result = BEARER_REGEXP.exec(bearer ?? "");
  const token = result?.groups?.token;

  if (!token?.length) {
    throw new Error("No bearer token present.");
  }

  return token;
};
