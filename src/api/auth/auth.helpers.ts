import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import jwtConfig from "../../configs/jwtConfig";
import type { ObjectId } from "mongodb";

export async function getHashedPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function matchPassword(hashPassword: string, password: string) {
  const matches = await bcrypt.compare(password, hashPassword);
  return matches;
}

export function createAccessToken(id: ObjectId, email: string) {
  return jwt.sign({ _id: id, email }, jwtConfig.ACCESS_SECRET!, {
    // expiresIn: jwtConfig.ACCESS_EXP!,
  });
}

export function createRefreshToken(id: ObjectId) {
  return jwt.sign({ _id: id }, jwtConfig.REFRESH_SECRET!, {
    expiresIn: jwtConfig.REFRESH_EXP!,
  });
}

export function decodeUserFromToken(token: string) {
  return jwt.verify(token, jwtConfig.ACCESS_SECRET!);
}
