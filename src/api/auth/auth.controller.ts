import type { NextFunction, Request, Response } from "express";
import { MongoServerError } from "mongodb";
import { v4 as uuidv4 } from "uuid";

import emailService from "../../services/nodemailer";
import {
  User,
  Users,
  type UserAccount,
  type UserWithId,
} from "../user/user.model";
import {
  createAccessToken,
  getHashedPassword /*getImageUrlByGender */,
} from "./auth.helpers";
import cookiesConfig from "../../configs/cookiesConfig";
import { getUserRedirectPage } from "../user/user.redirects";

export async function register(
  req: Request<{}, UserWithId, UserAccount>,
  res: Response,
  next: NextFunction,
) {
  try {
    // Create necessary data
    // const imageUrl = getImageUrlByGender(req.body.gender);
    const userData: UserAccount = {
      ...req.body,
      activationCode: uuidv4(),
      // imageUrl,
    };
    const validateResult = User.parse({ account: userData });

    //  hash password
    validateResult.account.password = await getHashedPassword(
      validateResult.account.password,
    );

    // Save user on db
    const insertResult = await Users.insertOne(validateResult, {});
    if (!insertResult.acknowledged) throw new Error("Error inserting user");

    // Send email with activation code
    await emailService.activationCode(
      validateResult.account.username,
      validateResult.account.email,
      validateResult.account.activationCode,
    );

    // Create cookies and set them in the client
    const accessToken = createAccessToken(
      insertResult.insertedId,
      validateResult.account.email,
    );

    res.cookie(
      cookiesConfig.access.name,
      accessToken,
      cookiesConfig.access.options,
    );

    res.status(201).json({
      message: "El correo electrónico se ha enviado",
    });
  } catch (err) {
    if (err instanceof MongoServerError) {
      return res.status(400).json({
        message: err.message.includes("username")
          ? "El nombre de usuario ya existe"
          : "El correo electrónico ya fue registrado",
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
        field: err.message.includes("username") ? "username" : "email",
      });
    }
    next(err);
  }
}

export const resendActivationCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as UserWithId;
    const { email, activationCode, isActivate, username } = user.account;

    // Throw error if the user account is already activated
    if (isActivate) {
      const redirect = getUserRedirectPage(user);
      return res
        .status(301)
        .json({ message: "La cuenta ya ha sido activada", redirect });
    }

    // Resend the email
    await emailService.activationCode(username, email, activationCode);

    res.status(200).json({ message: "El correo electrónico se ha enviado" });
  } catch (error) {
    next(error);
  }
};

export const activateAccount = async (
  req: Request<{ code: string }, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as UserWithId;
    const { activationCode } = user.account;
    const { code } = req.query;

    // Redirect to home page if the user account is already activated
    if (user.account.isActivate) {
      return res
        .status(301)
        .json({ message: "La cuenta ya está activada", redirect: "/" });
    }

    // Throw error if the code doesn't match with the user.acccount.activationCode
    if (activationCode !== code) {
      res.status(400);
      throw new Error("Código de activación incorrecto");
    }

    const updatedUser = await Users.findOneAndUpdate(
      { _id: user._id },
      { $set: { "account.isActivate": true } },
      { returnDocument: "after" },
    );

    if (!updatedUser.value) {
      res.status(404);
      throw new Error("Usuario no encontrado");
    }

    const redirect = getUserRedirectPage(updatedUser.value);

    res
      .status(301)
      .json({ message: "Cuenta activada correctamente", redirect });
  } catch (error) {
    next(error);
  }
};

/**
 * This endpoints should be fast because it is used in the
 * nextjs middleware for protect pages
 * here we can redirect to the user
 * to other page responding a 'redirect' property with the route
 *
 * !THIS ENDPOINT ALWAYS MUST RESPONSE A JSON
 */
export const validateAccessToken = async (req: Request, res: Response) => {
  const user = req.user as UserWithId;

  const redirect = getUserRedirectPage(user);

  if (redirect !== null) {
    return res.status(200).json({ redirect });
  }

  return res.status(200).json({
    log: "User is authenticated",
  });
};
