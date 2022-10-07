import Router from "express";
import { requireAuth, zValidation } from "../../middlewares";

import * as storyController from "./story.controller";
import { CreateStoryRequest } from "./story.schema";

const router = Router();

router.get("/random-image", storyController.getRandomImageForStory);

router.post(
  "/",
  requireAuth,
  zValidation(CreateStoryRequest),
  storyController.createStory,
);

export default router;
