import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import jwtConfig from "../../configs/jwtConfig";
import type { ObjectId } from "mongodb";
import type {
  UserWithId,
  UserClientSession,
  UserAccount,
} from "../user/user.model";

export function getImageUrlByGender(gender: string) {
  let normalizeGender = gender.toLowerCase();
  if (normalizeGender === "male") {
    return process.env.USER_MALE_IMAGE_URL;
  } else if (normalizeGender === "female") {
    return process.env.USER_FEMALE_IMAGE_URL;
  }
  return process.env.USER_NO_GENDER_IMAGE_URL;
}

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

export const getUserPublicData = (user: UserWithId) => {
  const publicUser: UserClientSession = user;

  const accountPropsToDelete: Array<keyof UserAccount> = [
    "password",
    "activationCode",
    "isActivate",
    "isDeleted",
  ];

  for (const prop of accountPropsToDelete) {
    delete publicUser.account[prop];
  }

  return publicUser;
};
