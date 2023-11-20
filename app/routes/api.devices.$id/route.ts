import { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { HTTPError } from "~/utils/error";
import { DELETE } from "./delete";
import { GET } from "./get";

export const action: ActionFunction = async (data) => {
  switch (data.request.method) {
    case "DELETE":
      return DELETE(data);
    default:
      return new HTTPError("Method Not Allowed", 405, { allow: "GET, DELETE" });
  }
};

export const loader: LoaderFunction = GET;
