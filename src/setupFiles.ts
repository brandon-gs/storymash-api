import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockReturnValue(() => {
      console.log("mock nodemailer");
    }),
  }),
}));
