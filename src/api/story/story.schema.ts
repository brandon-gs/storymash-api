import { z } from "zod";
import { ErrorMessages } from "../../errorMessages";

export const CreateStoryRequest = z.object({
  body: z.object({
    title: z
      .string({
        required_error: ErrorMessages.required_error,
      })
      .min(1, ErrorMessages.min(1)),
    categories: z
      .array(z.string(), { required_error: ErrorMessages.required_error })
      .min(1, ErrorMessages.min(1)),
    content: z.string({
      required_error: ErrorMessages.required_error,
    }),
  }),
});
export type CreateStoryRequest = z.infer<typeof CreateStoryRequest>;
export type CreateStoryRequestBody = z.infer<typeof CreateStoryRequest>["body"];
