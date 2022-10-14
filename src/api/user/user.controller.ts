import type { NextFunction, Request, Response } from "express";
import type {
  SaveUserGenderBodySchema,
  SaveUserInformationBodySchema,
} from "./user.schemas";
import { UserProfile, Users, type UserWithId } from "./user.model";
import { getImageUrlByGender, getUserPublicData } from "./user.helpers";
import { getUserRedirectPage } from "./user.redirects";
import imageUpload from "../../services/cloudinary/imageUpload";

export const getUser = async (req: Request, res: Response) => {
  const user = req.user as UserWithId;
  const publicUser = getUserPublicData(user);
  return res.status(200).json({ ...publicUser });
};

export const getUserAccount = async (req: Request, res: Response) => {
  const user = req.user as UserWithId;
  const { account } = getUserPublicData(user);
  return res.status(200).json({ account: account });
};

export const saveUserInformation = async (
  req: Request<{}, {}, SaveUserInformationBodySchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstname, lastname, birthdate } = req.body;
    const user = req.user as UserWithId;
    const newProfile: UserProfile = UserProfile.parse({
      firstname,
      lastname,
      birthdate,
    });

    /**
     * allow reuse this endpoint to update the personal information when the user
     * has a profile created before
     */
    const profile =
      user.profile !== null
        ? UserProfile.parse({ ...user.profile, firstname, lastname, birthdate })
        : newProfile;

    const updatedUser = await Users.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          profile,
        },
      },
      {
        returnDocument: "after",
      },
    );
    if (!updatedUser.value) {
      res.status(400);
      throw new Error("No se pudo actualizar la información");
    }
    const redirect = getUserRedirectPage(updatedUser.value);
    return res
      .status(200)
      .json({ message: "Información actualizada", redirect });
  } catch (error) {
    next(error);
  }
};

export const saveUserGender = async (
  req: Request<{}, {}, SaveUserGenderBodySchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { gender } = req.body;
    const imageUrl = getImageUrlByGender(gender);
    const user = req.user as UserWithId;
    const updatedUser = await Users.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          "profile.gender": gender,
          "profile.imageUrl": imageUrl,
        },
      },
      {
        returnDocument: "after",
      },
    );
    if (!updatedUser.value) {
      res.status(400);
      throw new Error("No se pudo actualizar la información");
    }
    const redirect = getUserRedirectPage(updatedUser.value);
    return res
      .status(200)
      .json({ message: "Información actualizada", redirect });
  } catch (error) {
    next(error);
  }
};

export const saveUserProfile = async (
  req: Request<{}, {}, { about: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // handle image upload if the file exists
    const image = await imageUpload(req);
    if (image.error) {
      res.status(400);
      throw new Error(image.message);
    }

    const user = req.user as UserWithId;

    // this allow us to keep the previous user's about if the user only sends the image
    const about = req.body.about ?? user.profile?.about ?? "";
    const imageUrl = image.imageUrl ?? user.profile?.imageUrl ?? "";

    const userUpdated = await Users.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          "account.onboardingComplete": true,
          "profile.about": about,
          "profile.imageUrl": imageUrl,
        },
      },
    );

    if (!userUpdated.value) {
      res.status(400);
      throw new Error("No se encontro el usuario");
    }

    res.status(200).json({
      message: "Información actualizada",
      redirect: getUserRedirectPage(userUpdated.value),
    });
  } catch (error) {
    next(error);
  }
};

export const onboardingFinish = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as UserWithId;
    if (!user.profile) {
      return res.status(404).json({
        message: "Debes tener un perfil creado para saltar este paso",
      });
    }
    await Users.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          "account.onboardingComplete": true,
        },
      },
    );
    return res.status(200).json({ message: "Información actualizada" });
  } catch (error) {
    next(error);
  }
};
