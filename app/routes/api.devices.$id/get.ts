import { json, LoaderFunction } from "@remix-run/cloudflare";
import { getDevice } from "~/utils/db/models/devices";
import { HTTPError, HTTP_ERROR } from "~/utils/error";

export const GET: LoaderFunction = async ({ context, params }) =>
  getDevice(params.id!, context as unknown as ContextEnv)
    .then((result) => {
      if (!result.length) {
        throw new HTTPError("Not Found", 404);
      }

      return json(result[0]);
    })
    .catch((e) => {
      console.error(e);

      if ((e as HTTPError).name === HTTP_ERROR) {
        return e.json();
      }

      throw new HTTPError((e as Error).message, 500);
    });
