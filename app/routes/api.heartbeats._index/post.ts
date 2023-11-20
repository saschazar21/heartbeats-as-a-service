import type { ActionFunction } from "@remix-run/cloudflare";
import {
  createHeartbeat,
  type Heartbeat,
  type Kernel,
  type OS,
  type System,
} from "~/utils/db/models/heartbeats";
import { HTTPError, HTTP_ERROR } from "~/utils/error";

const validatePayload = (data: Omit<Heartbeat, "id" | "timestamp">) => {
  if (!data.load?.length || !data.uptime) {
    throw new HTTPError("heartbeat data is incomplete.", 400);
  }
  if (
    !data?.kernel ||
    ["id", "arch", "hostname", "name", "version"].some(
      (key) => !data.kernel[key as keyof Kernel]?.length
    )
  ) {
    throw new HTTPError("'kernel' data is incomplete.", 400);
  }
  if (
    !data?.os ||
    ["id", "name", "version"].some((key) => !data.os[key as keyof OS]?.length)
  ) {
    throw new HTTPError("'os' data is incomplete.", 400);
  }
  if (
    !data?.system ||
    ["id", "cpu", "model_name"].some(
      (key) => !(data.system[key as keyof System] as string)?.length
    )
  ) {
    throw new HTTPError("'system' data is incomplete.", 400);
  }
  return true;
};

export const POST: ActionFunction = async ({ context, request }) => {
  try {
    let body: Omit<Heartbeat, "id" | "timestamp">;
    try {
      body = await request.json<Omit<Heartbeat, "id" | "timestamp">>();
    } catch (e) {
      throw new HTTPError("content-type must be of application/json.", 400);
    }

    validatePayload(body);

    const result = await createHeartbeat(
      body,
      context as unknown as ContextEnv
    );
    console.log(result);

    return new Response(null, { status: 204 });
  } catch (e) {
    if ((e as HTTPError).name === HTTP_ERROR) {
      return (e as HTTPError).json();
    }
    return new HTTPError((e as Error).message).json();
  }
};
