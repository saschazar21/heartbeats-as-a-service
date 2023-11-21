import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { HTTPError } from "~/utils/error";

const bearerRegExp = /^bearer\s(?<token>[^\s]+)$/i;

export const validateAuth = ({ context, request }: ActionFunctionArgs) => {
  const bearer = request.headers.get("authorization");

  if (!bearer?.length) {
    throw new HTTPError("Unauthorized", 401, { "www-authenticate": "Bearer" });
  }
  try {
    const result = bearerRegExp.exec(bearer ?? "");
    const token = result?.groups?.token;

    if (!token?.length) {
      throw new Error("No bearer token present.");
    }

    if (token !== (context.env as Record<string, string>).API_KEY) {
      throw new Error("Token/API key mismatch.");
    }

    return true;
  } catch (e) {
    throw new HTTPError("Forbidden", 403);
  }
};
