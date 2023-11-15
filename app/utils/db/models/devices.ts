import { getId } from "~/utils/helpers";
import { getCollection } from "../connection";
import { HEARTBEATS } from "./heartbeats";

export const DEVICES = "devices";

export interface Device {
  _id: string;
  location: string;
  created_at: Date;
}

export const createDevice = async (location: string, context: ContextEnv) => {
  const collection = await getCollection<Device>(DEVICES, context);

  const id = getId();
  const now = new Date();

  return collection.insertOne({
    _id: id,
    location,
    created_at: now,
  });
};

export const getDevice = async (id: string, context: ContextEnv) => {
  const collection = await getCollection<Device>(DEVICES, context);

  // return collection.findOne({ _id: id });
  return collection.aggregate([
    { $match: { _id: id } },
    {
      $lookup: {
        from: HEARTBEATS,
        pipeline: [
          {
            $match: { device: id },
          },
          {
            $count: "devices",
          },
        ],
        as: "devices",
      },
    },
  ]);
};

export const getDevices = async (context: ContextEnv) => {
  const collection = await getCollection<Device>(DEVICES, context);

  return collection.find();
};

export const deleteDevice = async (id: string, context: ContextEnv) => {
  const collection = await getCollection<Device>(DEVICES, context);

  return collection.deleteOne({ _id: id });
};
