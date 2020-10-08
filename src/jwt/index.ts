import jwt from "jsonwebtoken";
import { UserNoPWD } from "../db/users";
import { v4 as uuidv4 } from "uuid";

export interface JwtPayload {
  user: UserNoPWD;
}

export const generateJWT = (user: UserNoPWD): string => {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "15min" });
};

export const validateToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
};

export const generateJWTAndRefreshToken = (user: UserNoPWD) => {
  const jwtToken = generateJWT(user);
  const refreshToken = uuidv4();
  return { jwtToken, refreshToken };
};
