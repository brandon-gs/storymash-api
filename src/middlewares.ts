import type { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import passport from "passport";
import slowDown from "express-slow-down";

import ErrorResponse from "./interfaces/ErrorResponse";
import cookiesConfig from "./configs/cookiesConfig";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      validationErrors: err.issues.map((issue) => ({
        path: issue.path,
        fieldname: issue.path[2],
        message: issue.message,
      })),
    });
  }
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      res.clearCookie(cookiesConfig.access.name);
      return res.status(401).json({ message: "Sesión caducada" }); // send the error response to client
    }
    req.user = user;
    return next(); // continue to next middleware if no error.
  })(req, res, next);
};
export const requireLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(422).json({ message: "Credenciales incorrectas" });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

export const speedLimiter = slowDown({
  windowMs: 10 * 60 * 1000, // 10 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100:
});

export const zValidation =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          validationErrors: error.issues.map((issue) => ({
            path: issue.path,
            fieldname: issue.path[2],
            message: issue.message,
          })),
        });
      }
      return res.status(400).json({ message: "internal server error" });
    }
  };

// Maybe it can be added as global middleware for protect our api to be exposed for the public
// export const requireApiSecret = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Response | void => {
//   const api_key = req.headers["api-authorization"]
//   if (api_key === process.env.API_SECRET) {
//     next()
//   } else {
//     return res.status(404).json({ message: "Unauthorized" })
//   }
// }
