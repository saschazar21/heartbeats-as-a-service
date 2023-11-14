import { getId } from "~/utils/helpers";
import { getCollection } from "../connection";

export const DEVICES = "devices";

export interface Device {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export const createDevice = async () => {
  const collection = await getCollection(DEVICES);

  const id = getId();
  const now = new Date();

  return collection.insertOne({
    _id: id,
    id,
    created_at: now,
    updated_at: now,
  });
};
