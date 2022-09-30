import { Router } from "express";
import { requireAuth, speedLimiter, zValidation } from "../../middlewares";

import * as userController from "./user.controller";
import {
  SaveUserGenderSchema,
  SaveUserInformationSchema,
} from "./user.schemas";

const router = Router();

router.get(
  "/account",
  speedLimiter,
  requireAuth,
  userController.getUserAccount,
);

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

export default router;
