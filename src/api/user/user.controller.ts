import type { Request, Response } from "express";
import { getUserPublicData } from "../auth/auth.helpers";
import type { UserWithId } from "./user.model";

export const getUserAccount = async (req: Request, res: Response) => {
  const user = req.user as UserWithId;
  const { account } = getUserPublicData(user);
  return res.status(200).json({ account: account });
};
