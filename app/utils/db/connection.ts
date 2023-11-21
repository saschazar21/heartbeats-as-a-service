import { neon } from "@neondatabase/serverless";

export const getQuery = (context: ContextEnv) => neon(context.env.DB_URL);

export const executeStatement = async (
  context: ContextEnv,
  statement: string,
  values: unknown[] = []
) => {
  const sql = await getQuery(context);

  return sql(statement, values);
};
