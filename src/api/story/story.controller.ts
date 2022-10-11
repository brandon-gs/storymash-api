import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Stories, Story, StoryChapter } from "./story.model";
import type { UserWithId } from "../user/user.model";
import type { CreateStoryRequestBody } from "./story.schema";
import { getRandomImage } from "../../services/cloudinary";

export const getRandomImageForStory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { secure_url: randomImageUrl } = await getRandomImage({
      prefix: "default/default_story",
    });
    res.status(200).json({ randomImageUrl });
  } catch (error) {
    next(error);
  }
};

export const createStory = async (
  req: Request<{}, {}, CreateStoryRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { secure_url: imageUrl } = await getRandomImage({
      prefix: "default/default_story",
    });

    const user = req.user as UserWithId;
    const { title, categories, content } = req.body;

    const firstChapter = StoryChapter.parse({ _id: new ObjectId(), content });

    const newStory = Story.parse({
      authorId: user._id,
      title,
      imageUrl,
      categories,
      chapters: [firstChapter],
    });

    const story = await Stories.insertOne(newStory);

    if (!story.acknowledged) {
      res.status(400);
      throw new Error("Error al crear historia");
    }

    res
      .status(201)
      .json({ message: "Historia creada", storyId: story.insertedId });
  } catch (error) {
    next(error);
  }
};
