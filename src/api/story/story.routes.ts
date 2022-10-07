import Router from "express";

import * as storyController from "./story.controller";

const router = Router();

router.get("/random-image", storyController.getRandomImageForStory);

export default router;
