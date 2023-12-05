import { executeStatement, getQuery } from "../connection";
import type { Device } from "./devices";

export const HEARTBEATS = "heartbeats";
export const KERNELS = "kernels";
export const OPERATING_SYSTEMS = "operating_systems";
export const SYSTEMS = "systems";

export interface Kernel {
  id: string;
  arch: string;
  hostname: string;
  name: string;
  version: string;
}

export interface OS {
  id: string;
  build?: string;
  name: string;
  version: string;
}

export interface System {
  id: string | Device;
  cpu: string;
  model_name: string; // Get hardware model name: https://unix.stackexchange.com/a/574957, https://github.com/dylanaraps/neofetch/blob/ccd5d9f52609bbdcd5d8fa78c4fdb0f12954125f/neofetch#L1235
  serial?: string;
}

export interface Heartbeat {
  id: string;
  kernel: Kernel;
  operating_system: OS;
  system: System;
  ip_address: string;
  timestamp: string;
  uptime: number;
  load: number[];
}

export interface GetHeartbeatsParams {
  size: number;
  offset: number;
  from: string | null;
  to: string | null;
  device: string | null;
}

export const COUNT_HEARTBEATS = `SELECT COUNT(*)::INTEGER FROM ${HEARTBEATS}`;
export const countHeartbeats = async (context: ContextEnv) => {
  const rows = await executeStatement(context, COUNT_HEARTBEATS);

  return rows[0].count;
};

export const CREATE_KERNEL = `INSERT INTO ${KERNELS} (id, arch, hostname, name, version)
SELECT $1, $2, $3, $4, $5
WHERE NOT EXISTS (SELECT 1 FROM ${KERNELS} WHERE id = $1);
`;

export const CREATE_OPERATING_SYSTEM = `INSERT INTO ${OPERATING_SYSTEMS} (id, name, version, build)
SELECT $1, $2, $3, $4
WHERE NOT EXISTS (SELECT 1 FROM ${OPERATING_SYSTEMS} WHERE id = $1);
`;

export const CREATE_SYSTEM = `INSERT INTO ${SYSTEMS} (id, cpu, model_name, serial)
SELECT $1, $2, $3, $4
WHERE NOT EXISTS (SELECT 1 FROM ${SYSTEMS} WHERE id = $1);
`;

export const CREATE_HEARTBEAT = `INSERT INTO ${HEARTBEATS} (kernel, operating_system, system, ip_address, uptime, load)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id;
`;

export const createHeartbeat = async (
  data: Omit<Heartbeat, "id" | "timestamp">,
  context: ContextEnv
) => {
  const { kernel, operating_system, system } = data;
  const sql = getQuery(context);

  return sql.transaction([
    sql(CREATE_KERNEL, [
      kernel.id.trim(),
      kernel.arch.trim(),
      kernel.hostname.trim(),
      kernel.name.trim(),
      kernel.version.trim(),
    ]),
    sql(CREATE_OPERATING_SYSTEM, [
      operating_system.id.trim(),
      operating_system.name.trim(),
      operating_system.version.trim(),
      operating_system.build ?? null,
    ]),
    sql(CREATE_SYSTEM, [
      (system.id as string).trim(),
      system.cpu.trim(),
      system.model_name.trim(),
      system.serial ?? null,
    ]),
    sql(CREATE_HEARTBEAT, [
      kernel.id.trim(),
      operating_system.id.trim(),
      (system.id as string).trim(),
      data.ip_address,
      data.uptime,
      data.load,
    ]),
  ]);
};

export const GET_HEARTBEAT = `SELECT ${HEARTBEATS}.id, uptime, load, timestamp,
to_jsonb(${KERNELS}.*) as kernel,
to_jsonb(${OPERATING_SYSTEMS}.*) as operating_system,
to_jsonb(${SYSTEMS}.*) as system
FROM ${HEARTBEATS}
JOIN ${KERNELS} on ${HEARTBEATS}.kernel = ${KERNELS}.id
JOIN ${OPERATING_SYSTEMS} on ${HEARTBEATS}.operating_system = ${OPERATING_SYSTEMS}.id
JOIN ${SYSTEMS} on ${HEARTBEATS}.system = ${SYSTEMS}.id`;

export const GET_HEARTBEAT_BY_ID = `${GET_HEARTBEAT}
WHERE id = $1;`;
export const getHeartbeat = async (id: number, context: ContextEnv) => {
  return executeStatement(context, GET_HEARTBEAT_BY_ID, [id]);
};

export const GET_HEARTBEATS = `WITH data AS (
  ${GET_HEARTBEAT}
  WHERE ((timestamp BETWEEN $3 AND $4) OR $3 IS NULL OR $4 IS NULL)
  AND ((${HEARTBEATS}.system = $5) OR $5 IS NULL)
  ORDER BY timestamp DESC
  LIMIT $1
  OFFSET $2
),
meta AS (
  SELECT COUNT(*) as entries,
  CEIL(COUNT(*) / $1::REAL) as pages,
  SUM(FLOOR($2 / $1::REAL) + 1) as page
)
SELECT jsonb_build_object(
  'data', jsonb_agg(data),
  'meta', jsonb_agg(meta) -> 0
) as data
FROM data, meta`;
export const getHeartbeats = async (
  { size, offset, from, to, device }: GetHeartbeatsParams,
  context: ContextEnv
) => {
  const rows = await executeStatement(context, GET_HEARTBEATS, [
    size,
    offset,
    from,
    to,
    device,
  ]);

  return rows[0].data;
};
