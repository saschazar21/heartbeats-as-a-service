import { App, Credentials } from "realm-web";

if (
  !process.env.DB_APP_ID ||
  !process.env.DB_API_KEY ||
  !process.env.DB_DATABASE_NAME
) {
  throw new Error(
    "DB_APP_ID, DB_API_KEY & DB_DATABASE_NAME must be set in order to perform database operations!"
  );
}

export const getUser = async () => {
  const app = new App({ id: process.env.DB_APP_ID! });
  const credentials = Credentials.apiKey(process.env.DB_API_KEY!);

  return app.logIn(credentials);
};

export const getClient = async () => {
  const user = await getUser();

  return user.mongoClient(process.env.DB_CLUSTER_NAME ?? "mongodb-atlas");
};

export const getCollection = async (name: string) => {
  const client = await getClient();

  return client.db(process.env.DB_DATABASE_NAME!).collection(name);
};
