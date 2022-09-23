/**
 * Depend of some properties of the user
 * we must redirect the user to some page
 */

import { UserWithId } from "./user.model";

export function getUserRedirectPage(user: UserWithId) {
  if (user.account.isDeleted) {
    return "/";
  }

  if (!user.account.isActivate) {
    return "/activate-account";
  }

  if (user.profile === null) {
    return "/profile/complete";
  }
  // The user has all the necessary information so they can visit any page
  return null;
}
