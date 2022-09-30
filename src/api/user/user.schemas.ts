import { z } from "zod";
import { ErrorMessages } from "../../errorMessages";
import { DateSchema } from "../../utils/dateSchema";

const minDate = new Date();
minDate.setFullYear(new Date().getFullYear() - 100);

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);

/**
 * validation schema for the next endpoint
 * controller: saveUserInformation
 * url: /user/onboarding/information
 * method: POST
 */
export const SaveUserInformationSchema = z.object({
  body: z.object({
    firstname: z
      .string({
        required_error: ErrorMessages.required_error,
      })
      .min(3, ErrorMessages.min(3)),
    lastname: z
      .string({ required_error: ErrorMessages.required_error })
      .min(3, ErrorMessages.min(3)),
    birthdate: DateSchema,
  }),
});
export type SaveUserInformationSchema = z.infer<
  typeof SaveUserInformationSchema
>;
export type SaveUserInformationBodySchema = z.infer<
  typeof SaveUserInformationSchema
>["body"];

/**
 * validation schema for the next endpoint
 * controller: saveUserGender
 * url: /user/onboarding/gender
 * method: POST
 */
export const SaveUserGenderSchema = z.object({
  body: z.object({
    gender: z.string().min(3),
  }),
});
export type SaveUserGenderSchema = z.infer<typeof SaveUserGenderSchema>;
export type SaveUserGenderBodySchema = z.infer<
  typeof SaveUserGenderSchema
>["body"];
