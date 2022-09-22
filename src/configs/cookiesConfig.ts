import { CookieOptions } from "express";

interface ICookieConfig {
  name: string;
  options: CookieOptions;
  delete: CookieOptions;
}

const access: ICookieConfig = {
  name: process.env.COOKIE_ACCESS_NAME!,
  options: {
    sameSite: "strict",
    // domain: process.env.NODE_ENV === "development" ? "localhost" : ".com",
    httpOnly: true,
    secure: process.env.NODE_ENV! === "production",
    // maxAge: parseInt(process.env.ACCESS_EXP!),
    path: "/",
  },
  delete: {
    sameSite: "strict",
    // domain: process.env.NODE_ENV === "development" ? "localhost" : ".com",
    httpOnly: false,
    secure: !Boolean(process.env.NODE_ENV === "development"),
  },
};

const refresh: ICookieConfig = {
  name: process.env.COOKIE_REFRESH_NAME!,
  options: {
    sameSite: "strict",
    // domain: process.env.NODE_ENV === "development" ? "localhost" : ".com",
    httpOnly: true,
    secure: !Boolean(process.env.NODE_ENV === "development"),
    maxAge: parseInt(process.env.REFRESH_EXP!),
  },
  delete: {
    sameSite: "strict",
    // domain: process.env.NODE_ENV === "development" ? "localhost" : ".com",
    httpOnly: true,
    secure: !Boolean(process.env.NODE_ENV === "development"),
  },
};

export default {
  access,
  refresh,
};
