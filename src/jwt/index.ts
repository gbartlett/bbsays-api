import jwt from "jsonwebtoken";
import { UserNoPWD } from "../db/users";

export interface JwtPayload {
	user: UserNoPWD;
}

export const generateToken = (user: UserNoPWD): string => {
	return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "15min" });
};

export const validateToken = (token: string): JwtPayload => {
	return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
};
