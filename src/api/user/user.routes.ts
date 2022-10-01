import { Router } from "express";
import { requireAuth, speedLimiter, zValidation } from "../../middlewares";

import * as userController from "./user.controller";
import {
  SaveUserGenderSchema,
  SaveUserInformationSchema,
} from "./user.schemas";

/**
 * Router for the /api/v1/user/
 */
const router = Router();

router.get("/", speedLimiter, requireAuth, userController.getUser);
router.get(
  "/account",
  speedLimiter,
  requireAuth,
  userController.getUserAccount,
);

// endpoints for the onboarding process
router.put(
  "/onboarding/info",
  speedLimiter,
  requireAuth,
  zValidation(SaveUserInformationSchema),
  userController.saveUserInformation,
);
router.put(
  "/onboarding/gender",
  speedLimiter,
  requireAuth,
  zValidation(SaveUserGenderSchema),
  userController.saveUserGender,
);

export default router;
