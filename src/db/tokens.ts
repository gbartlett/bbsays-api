import { uid } from "rand-token";
import { DB } from "./client";

interface RefreshTokenData {
  readonly id: number;
  user_id: number;
  token: string;
  fingerprint: string;
}

export const getRefreshTokensForUser = async (
  userId: string | number
): Promise<RefreshTokenData[]> => {
  const queryText =
    "SELECT id, user_id, token, fingerprint FROM refresh_tokens WHERE user_id = $1";
  const result = await DB.query<RefreshTokenData, [string | number]>(
    queryText,
    [userId]
  );
  return result.rows;
};

export const createRefreshTokenForUser = async (
  userId: string | number,
  fingerprint: string
): Promise<string> => {
  const refreshToken = uid(16);
  const currentTokens = await getRefreshTokensForUser(userId);
  const numCurrentTokens = currentTokens.length;
  const { client, release } = await DB.getClient();

  await client.query<any, []>("BEGIN", []);

  try {
    if (numCurrentTokens > 5) {
      const queryText =
        "DELETE FROM refresh_tokens WHERE user_id = $1 WHERE user_id = $1";
      const result = await client.query<RefreshTokenData, [string | number]>(
        queryText,
        [userId]
      );

      if (result.rowCount < numCurrentTokens) {
        throw new Error(`Failed to delete all users tokens for ${userId}`);
      }
    }

    await client.query(
      "INSERT INTO refresh_tokens(user_id, token, fingerprint)  VALUES($1, $2, $3",
      [userId, refreshToken, fingerprint]
    );
  } catch (error) {
    await client.query<any, []>("ROLLBACK", []);
  } finally {
    release();
  }

  return refreshToken;
};
