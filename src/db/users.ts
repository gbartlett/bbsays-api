import { DB } from "./client";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  pwd_hash: string;
}

export type UserNoPWD = Omit<User, "pwd_hash">;

export const insertUser = async (
  user: Omit<User, "id" | "pwd_hash">
): Promise<UserNoPWD> => {
  const queryText =
    "INSERT INTO users(first_name, last_name, email) VALUES ($1, $2, $3) RETURNING id, first_name, last_name, email";
  const result = await DB.query<UserNoPWD, [string, string, string]>(
    queryText,
    [user.first_name, user.last_name, user.email]
  );

  return result.rows[0];
};

export const getUserById = async (
  id: string | number
): Promise<UserNoPWD | null> => {
  const queryText =
    "SELECT id, first_name, last_name, email FROM users WHERE id = $1";
  const result = await DB.query<UserNoPWD, [number | string]>(queryText, [id]);

  if (!result.rowCount) {
    return null;
  }
  return result.rows[0];
};

export const setUserPassword = async (
  rawPwd: string,
  userId: string | number
): Promise<UserNoPWD> => {
  const queryText = `UPDATE users SET pwd_hash = crypt($1, gen_salt('bf'))
    WHERE id = $2 RETURNING id, first_name, last_name, email`;
  const result = await DB.query<UserNoPWD, [string, number | string]>(
    queryText,
    [rawPwd, userId]
  );
  return result.rows[0];
};

export const authUser = async (
  email: string,
  rawPwd: string
): Promise<UserNoPWD | null> => {
  const queryText =
    "SELECT id, first_name, last_name, email FROM users WHERE email = $1 and pwd_hash = crypt($2, pwd_hash)";

  const result = await DB.query<UserNoPWD, [string, string]>(queryText, [
    email,
    rawPwd,
  ]);

  return result.rowCount === 1 ? result.rows[0] : null;
};
