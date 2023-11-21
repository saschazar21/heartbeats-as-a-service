import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { HTTPError } from "~/utils/error";
import { GET } from "./get";
import { validateAuth } from "./helpers";
import { POST } from "./post";

export const action: ActionFunction = async (data) => {
  switch (data.request.method) {
    case "POST":
      try {
        validateAuth(data);
      } catch (e) {
        return (e as HTTPError).json();
      }

      return POST(data);
    default:
      return new HTTPError("Method Not Allowed", 405, {
        allow: "GET, POST",
      }).json();
  }
};

export const loader: LoaderFunction = GET;
