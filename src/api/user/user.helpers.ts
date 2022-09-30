import type { UserAccount, UserClientSession, UserWithId } from "./user.model";

export function getImageUrlByGender(gender: string) {
  let normalizeGender = gender.toLowerCase();
  if (normalizeGender === "male") {
    return process.env.USER_MALE_IMAGE_URL;
  } else if (normalizeGender === "female") {
    return process.env.USER_FEMALE_IMAGE_URL;
  }
  return process.env.USER_NO_GENDER_IMAGE_URL;
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
