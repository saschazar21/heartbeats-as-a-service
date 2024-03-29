import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { getHeartbeats } from "~/utils/db/models/heartbeats";
import { HTTPError, HTTP_ERROR } from "~/utils/error";
import { parseDateParams, parsePaginationParams } from "~/utils/helpers";

export const GET: LoaderFunction = async ({ context, request }) => {
  const [size, offset] = parsePaginationParams(request);
  const [from, to] = parseDateParams(request);
  const device = new URL(request.url).searchParams.get("device");

  return getHeartbeats(
    { size, offset, from, to, device },
    context as unknown as ContextEnv
  )
    .then(json)
    .catch((e) => {
      console.error(e);
      if (e.name === HTTP_ERROR) {
        return (e as HTTPError).json();
      }
      return new HTTPError(e.message).json();
    });
};
