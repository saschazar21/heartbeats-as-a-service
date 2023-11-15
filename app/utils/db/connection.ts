import { App, Credentials } from "realm-web";

export const getUser = async (context: ContextEnv) => {
  if (!context.env.DB_APP_ID || !context.env.DB_API_KEY) {
    throw new Error(
      "DB_APP_ID & DB_API_KEY must be set in order to perform database operations!"
    );
  }

  const app = new App({ id: context.env.DB_APP_ID });
  const credentials = Credentials.apiKey(context.env.DB_API_KEY);

  return app.logIn(credentials);
};

export const getClient = async (context: ContextEnv) => {
  const user = await getUser(context);

  return user.mongoClient(context.env.DB_CLUSTER_NAME ?? "mongodb-atlas");
};

export const getCollection = async <
  T extends Realm.Services.MongoDB.Document<string>,
>(
  name: string,
  context: ContextEnv
) => {
  if (!context.env.DB_DATABASE_NAME) {
    throw new Error(
      "DB_DATABASE_NAME must be set in order to perform database operations!"
    );
  }
  const client = await getClient(context);

  return client.db(context.env.DB_DATABASE_NAME).collection<T>(name);
};
