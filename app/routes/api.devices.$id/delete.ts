import type { ActionFunction } from "@remix-run/cloudflare";
import { deleteDevice } from "~/utils/db/models/devices";

export const DELETE: ActionFunction = async ({ context, params }) =>
  deleteDevice(params.id!, context as unknown as ContextEnv).then(
    () => new Response(null, { status: 204 })
  );
