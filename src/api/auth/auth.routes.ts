import { Router } from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { requireAuth } from "../../middlewares";

import * as authController from "./auth.controller";

const router = Router();

const resendActivationCodeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1, // Limit each IP to 1 requests per `window` (here, per 1 minute)
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
  delayAfter: 2, // allow 5 requests to go at full-speed, then...
  delayMs: 500, // 3th request has a 500ms delay, 7th has a 200ms delay, 8th gets 300ms, etc.
});

router.post("/register", resendActivationSpeedLimiter, authController.register);
router.post(
  "/activation-code",
  resendActivationSpeedLimiter,
  resendActivationCodeLimiter,
  requireAuth,
  authController.resendActivationCode,
);
router.get(
  "/validate-access-token",
  requireAuth,
  authController.validateAccessToken,
);

export default router;
