import { Router } from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { requireAuth, requireLogin, speedLimiter } from "../../middlewares";

import * as authController from "./auth.controller";

const router = Router();

const resendActivationCodeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  // TODO: add this value to env variable
  max: process.env.EMAIL_RESEND_ACTIVATION_EMAIL_LIMIT,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Por favor, inténtalo más tarde",
  handler: (req, res, next, options) => {
    const timeRemain = res.getHeaders()["ratelimit-reset"];
    return res
      .status(options.statusCode)
      .json({ message: options.message, timeRemain });
  },
});

const resendActivationSpeedLimiter = slowDown({
  windowMs: 60 * 1000, // 15 minutes
  delayAfter: 5, // allow 5 requests to go at full-speed, then...
  delayMs: 500, // 3th request has a 500ms delay, 7th has a 200ms delay, 8th gets 300ms, etc.
});

router.get(
  "/validate-access-token",
  requireAuth,
  authController.validateAccessToken,
);
router.post("/register", resendActivationSpeedLimiter, authController.register);
router.post("/login", requireLogin, authController.login);
router.post("/logout", authController.logout);
router.post(
  "/activation-code",
  resendActivationSpeedLimiter,
  resendActivationCodeLimiter,
  requireAuth,
  authController.resendActivationCode,
);
router.post(
  "/activate-account",
  speedLimiter,
  requireAuth,
  authController.activateAccount,
);

export default router;
