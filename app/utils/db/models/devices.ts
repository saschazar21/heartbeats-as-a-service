import { getId } from "~/utils/helpers";
import { executeStatement } from "../connection";

export const DEVICES = "devices";

export interface Device {
  id: string;
  location: string;
  created_at: Date;
}

export const COUNT_DEVICES = `SELECT COUNT(*)::INTEGER FROM ${DEVICES}`;
export const countDevices = async (context: ContextEnv) => {
  const rows = await executeStatement(context, COUNT_DEVICES);

  return rows[0].count;
};

export const CREATE_DEVICE = `INSERT INTO ${DEVICES} (id, location) VALUES ($1, $2)`;
export const createDevice = async (location: string, context: ContextEnv) => {
  const id = getId();
  await executeStatement(context, CREATE_DEVICE, [id, location]);
  return id;
};

export const GET_DEVICE_BY_ID = `WITH device AS(
  SELECT *
  FROM ${DEVICES}
  WHERE id = $1
),
heartbeats AS(
  SELECT MAX(timestamp) as latest,
  COUNT(*)::Integer AS count
  FROM heartbeats
  WHERE system_id = $1
)
SELECT device.*, heartbeats.count AS heartbeats, heartbeats.latest
FROM device, heartbeats`;
export const getDevice = async (id: string, context: ContextEnv) => {
  return executeStatement(context, GET_DEVICE_BY_ID, [id]);
};

export const GET_DEVICES = `WITH data AS (
  SELECT *
  FROM ${DEVICES}
  ORDER BY created_at DESC
  LIMIT $1
  OFFSET $2
),
meta AS(
  SELECT COUNT(*) as entries,
  CEIL(COUNT(*) / $1::REAL) as pages,
  SUM(FLOOR($2 / $1::REAL) + 1) as page
  FROM ${DEVICES}
)
SELECT jsonb_build_object(
  'data', jsonb_agg(data),
  'meta', jsonb_agg(meta) -> 0
) AS data
FROM data, meta`;
export const getDevices = async (
  size: number,
  offset: number,
  context: ContextEnv
) => {
  const rows = await executeStatement(context, GET_DEVICES, [size, offset]);
  return rows[0].data;
};

export const DELETE_DEVICE_BY_ID = `DELETE FROM ${DEVICES} WHERE id = $1`;
export const deleteDevice = async (id: string, context: ContextEnv) => {
  return executeStatement(context, DELETE_DEVICE_BY_ID, [id]);
};
