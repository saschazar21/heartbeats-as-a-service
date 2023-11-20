import type { ActionFunction } from "@remix-run/cloudflare";
import { json } from "react-router";
import { getDevices } from "~/utils/db/models/devices";
import { HTTPError, HTTP_ERROR } from "~/utils/error";

export const DEFAULT_PAGE_SIZE = 10;

export const GET: ActionFunction = async ({ context, request }) => {
  const params = new URL(request.url).searchParams;
  const parsedPage = parseInt(params.get("page") ?? "", 10);
  const parsedSize = parseInt(params.get("size") ?? "", 10);

  const page = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 0;
  const size =
    !isNaN(parsedSize) && parsedSize > 0 ? parsedSize : DEFAULT_PAGE_SIZE;
  const offset = (page > 0 ? page - 1 : 0) * size;

  return getDevices(size, offset, context as unknown as ContextEnv)
    .then((data) => json(data))
    .catch((e) => {
      console.error(e);
      if (e.name === HTTP_ERROR) {
        return (e as HTTPError).json();
      }
      return new HTTPError(e.message).json();
    });
};
