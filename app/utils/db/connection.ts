import { Client } from "@neondatabase/serverless";

export const getClient = async (context: ContextEnv) => {
  const client = new Client(context.env.DB_URL);

  await client.connect();

  return client;
};
