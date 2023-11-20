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
  os: OS;
  system: System;
  timestamp: string;
  uptime: number;
  load: number[];
}

export const CREATE_KERNEL = `INSERT INTO ${KERNELS} (id, arch, hostname, name, version)
VALUES ($1, $2, $3, $4, $5)
WHERE NOT EXISTS (SELECT 1 FROM ${KERNELS} WHERE id = $1);
`;

export const CREATE_OPERATING_SYSTEM = `INSERT INTO ${OPERATING_SYSTEMS} (id, name, version, build)
VALUES ($1, $2, $3, $4)
WHERE NOT EXISTS (SELECT 1 FROM ${OPERATING_SYSTEMS} WHERE id = $1);
`;

export const CREATE_SYSTEM = `INSERT INTO ${SYSTEMS} (id, cpu, model_name, serial)
VALUES ($1, $2, $3, $4)
WHERE NOT EXISTS (SELECT 1 FROM ${SYSTEMS} WHERE id = $1);
`;

export const CREATE_HEARTBEAT = `INSERT INTO ${HEARTBEATS} (kernel_id, operating_system_id, system_id, uptime, load)
VALUES ($1, $2, $3, $4, $5)
RETURNING id;
`;

export const createHeartbeat = async (
  data: Omit<Heartbeat, "id" | "timestamp">,
  context: ContextEnv
) => {
  const { kernel, os, system } = data;
  const sql = await getQuery(context);

  return sql.transaction([
    sql(CREATE_HEARTBEAT, [
      kernel.id,
      os.id,
      system.id,
      data.uptime,
      data.load,
    ]),
    sql(CREATE_KERNEL, [
      kernel.id,
      kernel.arch,
      kernel.hostname,
      kernel.name,
      kernel.version,
    ]),
    sql(CREATE_OPERATING_SYSTEM, [
      os.id,
      os.name,
      os.version,
      os.build ?? null,
    ]),
    sql(CREATE_SYSTEM, [
      system.id,
      system.cpu,
      system.model_name,
      system.serial ?? null,
    ]),
  ]);
};

export const GET_HEARTBEAT = `SELECT id, uptime, load, timestamp,
to_jsonb(${KERNELS}.*) as ${KERNELS},
to_jsonb(${OPERATING_SYSTEMS}.*) as ${OPERATING_SYSTEMS},
to_jsonb(${SYSTEMS}.*) as ${SYSTEMS}
FROM ${HEARTBEATS}
JOIN ${KERNELS} on ${HEARTBEATS}.kernel_id = ${KERNELS}.id
JOIN ${OPERATING_SYSTEMS} on ${HEARTBEATS}.operating_system_id = ${OPERATING_SYSTEMS}.id
JOIN ${SYSTEMS} on ${HEARTBEATS}.system_id = ${SYSTEMS}.id`;

export const GET_HEARTBEAT_BY_ID = `${GET_HEARTBEAT}
WHERE id = $1;`;
export const getHeartbeat = async (id: number, context: ContextEnv) => {
  return executeStatement(context, GET_HEARTBEAT_BY_ID, [id]);
};

export const GET_HEARTBEATS = `WITH data AS (
  ${GET_HEARTBEAT}
  LIMIT $1
  OFFSET $2
),
meta AS (
  SELECT COUNT(*) as entries,
  CEIL(COUNT(*) / $1::REAL) as pages,
  SUM(FLOOR($2 / $1::REAL) + 1) as page
)
SELECT jsonb_build_object(
  'data': jsonb_agg(data),
  'meta': jsonb_agg(meta) -> 0
) as data
FROM data, meta`;
export const getHeartbeats = async (
  size: number,
  offset: number,
  context: ContextEnv
) => {
  const rows = await executeStatement(context, GET_HEARTBEATS, [size, offset]);

  return rows[0].data;
};
