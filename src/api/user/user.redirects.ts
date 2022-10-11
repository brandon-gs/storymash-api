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

  /**
   * Redirect to the onboarding routes only if the user never finish it before
   */
  const isOnboardingComplete = user.account.onboardingComplete;
  if (!isOnboardingComplete) {
    if (!user.profile) return "/onboarding/info";

    if (!user.profile.gender || user.profile.gender === "") {
      return "/onboarding/gender";
    }

    return "/onboarding/profile";
  }
  // The user has all the necessary information so they can visit any page
  return null;
}
