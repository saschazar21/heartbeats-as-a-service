import { type ActionFunction, json } from "@remix-run/cloudflare";
import { createDevice } from "~/utils/db/models/devices";
import { HTTPError, HTTP_ERROR } from "~/utils/error";

export const POST: ActionFunction = async (data) => {
  try {
    const params = new URL(data.request.url).searchParams;
    const body = await data.request.formData();

    const location = body.get("location") as string | null;
    if (!location?.length) {
      throw new HTTPError("'location' field is missing in request body.", 400);
    }

    const id = await createDevice(
      location.trim(),
      data.context as unknown as ContextEnv
    );

    return params.get("format") === "text"
      ? new Response(id, {
          status: 200,
          headers: { "content-type": "text/plain" },
        })
      : json({ id });
  } catch (e) {
    console.error(e);
    if ((e as Error).name === HTTP_ERROR) {
      return (e as HTTPError).json();
    }

    return new HTTPError((e as HTTPError).message).json();
  }
};
