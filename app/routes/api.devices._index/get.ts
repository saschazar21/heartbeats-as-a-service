import type { ActionFunction } from "@remix-run/cloudflare";
import { json } from "react-router";
import { getDevices } from "~/utils/db/models/devices";
import { HTTPError, HTTP_ERROR } from "~/utils/error";
import { parsePaginationParams } from "~/utils/helpers";

export const GET: ActionFunction = async ({ context, request }) => {
  const [size, offset] = parsePaginationParams(request);

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
