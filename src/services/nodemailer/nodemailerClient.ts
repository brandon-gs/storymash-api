import nodemailer from "nodemailer";

/**
 * To read more about transport services consult
 * {@link https://community.nodemailer.com/2-0-0-beta/setup-smtp/well-known-services/ | service}
 */

const nodemailerClientProd = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    // accessToken: "ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x",
  },
});

const nodemailerClienTest = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
});

const nodemailerClient =
  process.env.NODE_ENV === "test" ? nodemailerClienTest : nodemailerClientProd;

export default nodemailerClient;
