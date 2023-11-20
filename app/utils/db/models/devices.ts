import { getId } from "~/utils/helpers";
import { getClient } from "../connection";

export const DEVICES = "devices";

export interface Device {
  _id: string;
  location: string;
  created_at: Date;
}

const executeStatement = async (
  context: ContextEnv,
  statement: string,
  variables: unknown[] = []
) => {
  const client = await getClient(context);
  const result = await client.query(statement, variables);

  await client.end();

  return result;
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
  SELECT MAX(timestamp) as latest, COUNT(*) AS count
  FROM heartbeats
  WHERE system_id = $1
)
SELECT device.*, heartbeats.count AS heartbeats, heartbeats.latest
FROM device, heartbeats`;
export const getDevice = async (id: string, context: ContextEnv) => {
  const { rows } = await executeStatement(context, GET_DEVICE_BY_ID, [id]);
  return rows;
};

export const GET_DEVICES = `SELECT *
FROM ${DEVICES}
ORDER BY created_at DESC
LIMIT $1
OFFSET $2`;
export const getDevices = async (
  size: number,
  offset: number,
  context: ContextEnv
) => {
  const { rows } = await executeStatement(context, GET_DEVICES, [size, offset]);
  return rows;
};

export const DELETE_DEVICE_BY_ID = `DELETE FROM ${DEVICES} WHERE id = $1`;
export const deleteDevice = async (id: string, context: ContextEnv) => {
  const { rows } = await executeStatement(context, DELETE_DEVICE_BY_ID, [id]);

  return rows;
};
