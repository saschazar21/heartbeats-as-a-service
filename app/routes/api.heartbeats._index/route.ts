import type { ActionFunction } from "@remix-run/cloudflare";
import { HTTPError } from "~/utils/error";
import { GET } from "./get";
import { validateAuth } from "./helpers";
import { POST } from "./post";

export const action: ActionFunction = async (data) => {
  switch (data.request.method) {
    case "POST":
      let id: string;
      try {
        id = await validateAuth(data);
      } catch (e) {
        return (e as HTTPError).json();
      }

      data.context.id = id;

      return POST(data);
    default:
      return new HTTPError("Method Not Allowed", 405, {
        allow: "GET, POST",
      }).json();
  }
};

export const loader = GET;
