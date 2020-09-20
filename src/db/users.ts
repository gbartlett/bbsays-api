import { getFieldsAndValuesForUpdate } from "../utils/getFieldsAndValues";
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
}

export enum UPDATABLE_PROPERTIES {
	first_name = "first_name",
	last_name = "last_name",
	email = "email",
	role = "role",
}

export type UserNoPWD = Omit<User, "pwd_hash">;

export const insertUser = async (
	user: Omit<User, "id" | "pwd_hash">
): Promise<UserNoPWD> => {
	const queryText =
		"INSERT INTO users(first_name, last_name, email) VALUES ($1,$2,$3) RETURNING id, first_name, last_name, email";
	const result = await DB.query<UserNoPWD, [string, string, string]>(
		queryText,
		[user.first_name, user.last_name, user.email]
	);

	return result.rows[0];
};

export const updateUser = async (
	userId: string | number,
	payload: Omit<UserNoPWD, "id">
): Promise<UserNoPWD> => {
	const { fields, values, nextParamIndex } = getFieldsAndValuesForUpdate(
		Object.keys(UPDATABLE_PROPERTIES),
		payload
	);
	const queryText = `UPDATE users SET ${fields.join(
		", "
	)} WHERE id = ${nextParamIndex}`;
	const result = await DB.query<UserNoPWD, any[]>(queryText, [
		...values,
		userId,
	]);
	return result.rows[0];
};

export const getUserById = async (
	id: string | number
): Promise<UserNoPWD | null> => {
	const queryText =
		"SELECT id, first_name, last_name, email, role, coach_id FROM users WHERE id = $1";
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
		"SELECT id, first_name, last_name, email, role, coach_id \
		FROM users WHERE email = $1 and pwd_hash = crypt($2, pwd_hash)";

	const result = await DB.query<UserNoPWD, [string, string]>(queryText, [
		email,
		rawPwd,
	]);

	return result.rowCount === 1 ? result.rows[0] : null;
};

export const getClients = async (coachId: string): Promise<UserNoPWD[]> => {
	const queryText =
		"SELECT id, first_name, last_name, email FROM users WHERE coach_id = $1";
	const result = await DB.query<UserNoPWD, [string | number]>(queryText, [
		coachId,
	]);
	return result.rows;
};
