import { Router } from "express";
import { requireAuth, zValidation } from "../../middlewares";

import * as userController from "./user.controller";
import {
  SaveUserGenderSchema,
  SaveUserInformationSchema,
} from "./user.schemas";

/**
 * Router for the /api/v1/user/
 */
const router = Router();

router.get("/", requireAuth, userController.getUser);
router.get("/account", requireAuth, userController.getUserAccount);

// endpoints for the onboarding process
router.put(
  "/onboarding/info",
  requireAuth,
  zValidation(SaveUserInformationSchema),
  userController.saveUserInformation,
);
router.put(
  "/onboarding/gender",
  requireAuth,
  zValidation(SaveUserGenderSchema),
  userController.saveUserGender,
);
router.put("/onboarding/profile", requireAuth, userController.saveUserProfile);
router.put("/onboarding/finish", requireAuth, userController.onboardingFinish);

export default router;
