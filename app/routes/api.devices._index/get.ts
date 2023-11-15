import type { ActionFunction } from "@remix-run/cloudflare";
import { json } from "react-router";
import { getDevices } from "~/utils/db/models/devices";
import { HTTPError, HTTP_ERROR } from "~/utils/error";

export const GET: ActionFunction = async ({ context }) =>
  getDevices(context as unknown as ContextEnv)
    .then((data) => json(data))
    .catch((e) => {
      if (e.name === HTTP_ERROR) {
        return (e as HTTPError).json();
      }
      return new HTTPError(e.message).json();
    });
