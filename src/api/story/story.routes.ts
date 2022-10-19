import Router from "express";
import { requireAuth, zValidation } from "../../middlewares";

import * as storyController from "./story.controller";
import { CreateStoryRequest } from "./story.schema";

const router = Router();

router.get("/random-image", storyController.getRandomImageForStory);

router
  .route("/")
  .get(storyController.getAllStories)
  .post(
    requireAuth,
    zValidation(CreateStoryRequest),
    storyController.createStory,
  );

router
  .route("/chapter/like")
  .put(requireAuth, storyController.addLikeStoryChapter);

export default router;
