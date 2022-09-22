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
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as UserWithId;
    const { email } = user.account;
    const userResult = await Users.findOne(
      { "account.email": email },
      { projection: { "account.email": 1, "account.isActivate": 1 } },
    );
    // Throw error if the user email is not found
    if (userResult === null)
      throw new Error("Correo electrónico no encontrado");

    // Throw error if the user account is already activated or deleted
    if (userResult.account.isActivate || userResult.account.isDeleted)
      throw new Error("La cuenta ya ha sido activada");

    // Resend the email
    await emailService.activationCode(
      userResult.account.username,
      userResult.account.email,
      userResult.account.activationCode,
    );

    res.status(200).json({ message: "El correo electrónico se ha enviado" });
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

  if (!user.account.isActivate) {
    return res.status(200).json({
      message: "User is not activated",
      redirect: "/activate-account",
    });
  }

  return res.status(200).json({
    message: "User is authenticated",
  });
};
