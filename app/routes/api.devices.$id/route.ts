import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { HTTPError } from "~/utils/error";
import { validateBearer } from "~/utils/helpers";
import { DELETE } from "./delete";
import { GET } from "./get";

export const action: ActionFunction = async (data) => {
  switch (data.request.method) {
    case "DELETE":
      try {
        validateBearer(data);
      } catch (e) {
        return (e as HTTPError).json();
      }

      return DELETE(data);
    default:
      return new HTTPError("Method Not Allowed", 405, { allow: "GET, DELETE" });
  }
};

export const loader: LoaderFunction = GET;
