import type { ActionFunction } from "@remix-run/cloudflare";
import { json } from "react-router";
import { createDevice } from "~/utils/db/models/devices";
import { HTTPError, HTTP_ERROR } from "~/utils/error";

export const POST: ActionFunction = async (data) => {
  try {
    const body = await data.request.formData();

    const location = body.get("location") as string | null;
    if (!location?.length) {
      throw new HTTPError("'location' field is missing in request body.", 400);
    }

    const device = await createDevice(
      location,
      data.context as unknown as ContextEnv
    );

    return json({ id: device.insertedId });
  } catch (e) {
    if ((e as Error).name === HTTP_ERROR) {
      return (e as HTTPError).json();
    }

    return new HTTPError((e as HTTPError).message).json();
  }
};
