import type { NextFunction, Request, Response } from "express";
import type {
  SaveUserGenderBodySchema,
  SaveUserInformationBodySchema,
} from "./user.schemas";
import { UserProfile, Users, type UserWithId } from "./user.model";
import { getImageUrlByGender, getUserPublicData } from "./user.helpers";
import { getUserRedirectPage } from "./user.redirects";

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
