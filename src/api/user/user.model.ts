import { WithId } from "mongodb";
import * as z from "zod";

import { db } from "../../db";
import { ChangeFields } from "../../interfaces/ChangeFields";

export const UserAccount = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(10, "El nombre de usuario debe tener al menos 10 caracteres")
    .regex(
      new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,10}$/gi),
      "Nombre de usuario no válido",
    )
    .transform((val) => val.toLowerCase()),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Correo electrónico inválido."),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 carácteres")
    .max(32, "La contraseña debe tener máximo 32 carácteres"),
  activationCode: z.string(),
  isActivate: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  onboardingComplete: z.boolean().default(false),
});

export const UserProfile = z.object({
  firstname: z.string().min(3).default(""),
  lastname: z.string().min(3).default(""),
  birthdate: z.string(),
  gender: z.string().default(""),
  imageUrl: z.string().default(""),
  about: z.string().default(""),
});

export const User = z.object({
  account: UserAccount,
  profile: UserProfile.nullable().default(null),
  createdAt: z.string().default(new Date().toUTCString()),
});

export type User = z.infer<typeof User>;
export type UserAccount = z.infer<typeof UserAccount>;
export type UserProfile = z.infer<typeof UserProfile>;
export type UserWithId = WithId<User>;
export type UserClientSession = ChangeFields<
  UserWithId,
  {
    account: Omit<
      UserWithId["account"],
      "password" | "activationCode" | "isActive" | "isDeleted"
    > & {
      password?: string;
      activationCode?: string;
      isActive?: boolean;
      isDeleted?: boolean;
    };
  }
>;
export const Users = db.collection<User>("users");
