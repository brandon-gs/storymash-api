import { Router } from "express";
import { requireAuth, speedLimiter } from "../../middlewares";

import * as userController from "./user.controller";

const router = Router();

router.get(
  "/account",
  speedLimiter,
  requireAuth,
  userController.getUserAccount,
);

export default router;
