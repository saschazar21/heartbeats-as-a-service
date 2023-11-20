import type { Device } from "./devices";

export const HEARTBEATS = "heartbeats";

export interface Kernel {
  arch: string;
  hostname: string;
  name: string;
  version: string;
}

export interface OS {
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
