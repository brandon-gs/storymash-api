import { NextFunction, Request, Response } from "express";
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
