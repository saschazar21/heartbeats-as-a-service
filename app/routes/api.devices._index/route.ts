import type { ActionFunction } from "@remix-run/cloudflare";
import { HTTPError } from "~/utils/error";
import { GET } from "./get";
import { POST } from "./post";

export const action: ActionFunction = async (data) => {
  switch (data.request.method) {
    case "GET":
      return GET(data);
    case "POST":
      return POST(data);
    default:
      return new HTTPError("Method Not Allowed", 405, {
        allow: "GET, POST",
      }).json();
  }
};
