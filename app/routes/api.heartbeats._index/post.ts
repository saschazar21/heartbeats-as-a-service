import type { ActionFunction } from "@remix-run/cloudflare";
import {
  createHeartbeat,
  type Heartbeat,
  type Kernel,
  type OS,
  type System,
} from "~/utils/db/models/heartbeats";
import { HTTPError, HTTP_ERROR } from "~/utils/error";

const validatePayload = (
  data: Omit<Heartbeat, "id" | "ip_address" | "timestamp">,
  id: string
) => {
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
    !data?.operating_system ||
    ["id", "name", "version"].some(
      (key) => !data.operating_system[key as keyof OS]?.length
    )
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
  if (data.system.id !== id) {
    throw new HTTPError("bearer token and system ID must be equal.", 400);
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

    validatePayload(body, context.id as string);

    const ip_address =
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for") ??
      "0.0.0.0";

    await createHeartbeat(
      {
        ...body,
        ip_address,
      },
      context as unknown as ContextEnv
    );

    return new Response(null, { status: 204 });
  } catch (e) {
    if ((e as HTTPError).name === HTTP_ERROR) {
      return (e as HTTPError).json();
    }
    return new HTTPError((e as Error).message).json();
  }
};
