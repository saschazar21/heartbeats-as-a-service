import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { checkDevice } from "~/utils/db/models/devices";
import { HTTPError, HTTP_ERROR } from "~/utils/error";
import { parseBearerToken } from "~/utils/helpers";

export const validateAuth = async (data: ActionFunctionArgs) => {
  try {
    const token = await parseBearerToken(data.request);
    let result = null;

    try {
      result = await checkDevice(token, data.context as unknown as ContextEnv);
    } catch (e) {
      throw new HTTPError("Internal Server Error");
    }

    if (!result) {
      throw new Error(`Device ${token} does not exist.`);
    }

    return result;
  } catch (e) {
    if ((e as HTTPError).name === HTTP_ERROR) {
      throw e;
    }
    throw new HTTPError("Forbidden", 403);
  }
};
