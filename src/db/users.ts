import { v4 as uuidv4 } from "uuid";
import { generateToken } from "../jwt";
import { getFieldsAndValuesForUpdate } from "../utils/getFieldsAndValues";
import logger from "../utils/logger";
import { DB } from "./client";

export enum ROLES {
  COACH = "COACH",
  CLIENT = "CLIENT",
}

export interface User {
  readonly id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: ROLES;
  coach_id: number;
  pwd_hash: string;
  refresh_token: string;
}

export enum UPDATABLE_PROPERTIES {
  first_name = "first_name",
  last_name = "last_name",
  email = "email",
  role = "role",
  refresh_token = "refresh_token",
}

export type UserNoPWD = Omit<User, "pwd_hash">;

export const insertUser = async (
  user: Omit<User, "id" | "pwd_hash">,
): Promise<UserNoPWD | undefined> => {
  const queryText =
    "INSERT INTO users(first_name, last_name, email) VALUES ($1, $2, $3) RETURNING id, first_name, last_name, email";
  let result;

  try {
    result = await DB.query<UserNoPWD, [string, string, string]>(queryText, [
      user.first_name,
      user.last_name,
      user.email,
    ]);
  } catch (error) {
    logger.error("An error occured while creating user", {
      email: user.email,
      error,
    });
  }

  if (!result?.rowCount) {
    logger.error("No user created", {
      email: user.email,
      error: new Error("No user created after insert statement"),
    });
    return;
  }

  return result.rows[0];
};

export const updateUser = async (
  userId: string | number,
  payload: Partial<User>,
): Promise<UserNoPWD | undefined> => {
  const { fields, values, nextParamIndex } = getFieldsAndValuesForUpdate(
    Object.keys(UPDATABLE_PROPERTIES),
    payload,
  );
  const fieldParams = fields.join(", ");
  const queryText = `UPDATE users SET ${fieldParams} WHERE id = $${nextParamIndex} RETURNING id`;
  let result;

  try {
    result = await DB.query<UserNoPWD, any[]>(queryText, [...values, userId]);
  } catch (error) {
    logger.error("An error occurred updating user", {
      userId,
      error,
    });
    return;
  }

  if (result.rowCount === 0) {
    return;
  }

  return result.rows[0];
};

export const getUserById = async (
  id: string | number,
): Promise<UserNoPWD | undefined> => {
  const queryText =
    "SELECT id, first_name, last_name, email, role, coach_id FROM users WHERE id = $1";
  let result;

  try {
    result = await DB.query<UserNoPWD, [number | string]>(queryText, [id]);
  } catch (error) {
    logger.error("An error occured while fetching user", {
      error,
      userId: id,
    });
    return;
  }

  if (!result.rowCount) {
    logger.info("No user found", {
      userId: id,
    });
    return;
  }

  return result.rows[0];
};

export const setUserPassword = async (
  rawPwd: string,
  userId: string | number,
): Promise<UserNoPWD> => {
  const queryText = `UPDATE users SET pwd_hash = crypt($1, gen_salt('bf'))
  WHERE id = $2 RETURNING id, first_name, last_name, email`;
  const result = await DB.query<UserNoPWD, [string, number | string]>(
    queryText,
    [rawPwd, userId],
  );
  return result.rows[0];
};

export const authUser = async (
  email: string,
  rawPwd: string,
): Promise<
  { user: UserNoPWD; token: string; refreshToken: string } | undefined
> => {
  const queryText =
    "SELECT id, first_name, last_name, email, role, coach_id \
    FROM users WHERE email = $1 and pwd_hash = crypt($2, pwd_hash)";
  let result;

  try {
    result = await DB.query<UserNoPWD, [string, string]>(queryText, [
      email,
      rawPwd,
    ]);
  } catch (error) {
    logger.error("An error occured while authing user", {
      error,
      email,
    });
  }

  if (result?.rowCount !== 1) {
    logger.error("No user found", {
      error: new Error("No user was found while authing user"),
      email,
    });
    return;
  }
  const user = result.rows[0];
  const refreshToken = uuidv4();
  const userId = await updateUser(user.id, { refresh_token: refreshToken });

  if (!userId) {
    return;
  }

  const token = generateToken(user);
  return { user, token, refreshToken };
};

export const getClients = async (
  coachId: string,
): Promise<UserNoPWD[] | undefined> => {
  const queryText =
    "SELECT id, first_name, last_name, email FROM users WHERE coach_id = $1";

  let result;

  try {
    result = await DB.query<UserNoPWD, [string | number]>(queryText, [coachId]);
  } catch (error) {
    logger.error("An error occured while fetching clients", {
      error,
      userId: coachId,
    });
    return;
  }

  return result.rows;
};
