import { z } from "zod";

const minDate = new Date();
minDate.setFullYear(new Date().getFullYear() - 100);

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);

export const DateSchema = z.preprocess(
  (arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  },
  z
    .date({
      errorMap: (issue) => {
        const date = `${minDate.getDate()}/${
          minDate.getMonth() + 1
        }/${minDate.getFullYear()}`;
        if (issue.code === "too_small") {
          return {
            message: `La fecha debe ser mayor o igual a ${date}`,
          };
        }
        if (issue.code === "too_big") {
          return {
            message: `La fecha debe ser menor o igual a ${date}`,
          };
        }
        return {
          message: "Fecha no válida",
        };
      },
    })
    .min(minDate)
    .max(maxDate),
);
export type DateSchema = z.infer<typeof DateSchema>;
