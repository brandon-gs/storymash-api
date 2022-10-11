import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import test from "./test/test.routes";
import auth from "./auth/auth.routes";
import user from "./user/user.routes";
import story from "./story/story.routes";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/auth", auth);
router.use("/user", user);
router.use("/story", story);

if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
  router.use("/test", test);
}

export default router;
