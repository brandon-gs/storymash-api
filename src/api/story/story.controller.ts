import type { NextFunction, Request, Response } from "express";
import type { CreateStoryRequestBody } from "./story.schema";
import type { UserWithId } from "../user/user.model";
import { ObjectId } from "mongodb";
import { Stories, Story, StoryChapter } from "./story.model";
import { getRandomImage } from "../../services/cloudinary";
import paginateCollection from "../../utils/paginateCollection";
import { storyCardAggregations } from "./story.aggregations";
import { storyFilterByChapterId } from "./story.helpers";

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

export const getAllStories = async (
  req: Request<{}, {}, {}, { page: string; limit: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit } = req.query;
    const pagination = await paginateCollection<Story>({
      collection: "stories",
      currentPage: parseInt(page),
      limit: parseInt(limit),
      aggregations: storyCardAggregations,
    });
    res.status(200).json({ ...pagination });
  } catch (e) {
    next(e);
  }
};

export const addLikeStoryChapter = async (
  req: Request<
    {},
    {},
    {},
    { storyId: string; chapterId: string; action: "add" | "remove" }
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as UserWithId;
    const userId = user._id.toString();
    const { storyId = "", chapterId = "", action } = req.query;

    const storyFilter = storyFilterByChapterId(storyId, chapterId);

    const story = await Stories.findOne(storyFilter, {
      projection: {
        _id: 1,
        "chapters.$": 1,
        authorId: 1,
      },
    });

    if (!story) {
      res.status(404);
      throw Error("Historia no encontrada");
    }

    const isAuthor = story.authorId.toString() === userId;
    if (isAuthor) {
      res.status(405);
      throw new Error("No puedes darle me gusta a esta historia");
    }

    if (action === "add") {
      await Stories.updateOne(storyFilter, {
        $addToSet: {
          "chapters.$.likes": userId,
        },
      });
    }

    if (action === "remove") {
      await Stories.updateOne(storyFilter, {
        $pull: {
          "chapters.$.likes": userId,
        },
      });
    }

    res.status(200).json({ storyId, chapterId });
  } catch (e) {
    next(e);
  }
};
