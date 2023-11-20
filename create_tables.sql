CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  location TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE kernels (
  id TEXT PRIMARY KEY,
  hostname TEXT NOT NULL,
  name TEXT NOT NULL,
  version TEXT NOT NULL
);

CREATE TABLE operating_systems (
  id TEXT PRIMARY KEY NOT NULL,
  build TEXT,
  name TEXT NOT NULL,
  version TEXT NOT NULL
);

CREATE TABLE systems (
  id TEXT PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
  cpu TEXT NOT NULL,
  model_name TEXT NOT NULL,
  serial TEXT
);

CREATE TABLE heartbeats (
  id BIGSERIAL PRIMARY KEY,
  system_id TEXT REFERENCES systems(id) ON DELETE SET NULL,
  kernel_id TEXT REFERENCES kernels(id) ON DELETE SET NULL,
  operating_system_id TEXT REFERENCES operating_systems(id) ON DELETE SET NULL,
  uptime INTEGER NOT NULL,
  load JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);