import { uid } from "uid/secure";

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_UID_LENGTH = 16;

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
