import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { HTTPError, HTTP_ERROR } from "~/utils/error";
import { parseBearerToken } from "~/utils/helpers";

export const validateAuth = ({ context, request }: ActionFunctionArgs) => {
  try {
    const token = parseBearerToken(request);

    if (token !== (context.env as Record<string, string>).API_KEY) {
      throw new Error("Token/API key mismatch.");
    }

    return true;
  } catch (e) {
    if ((e as HTTPError).name === HTTP_ERROR) {
      throw e;
    }
    throw new HTTPError("Forbidden", 403);
  }
};
