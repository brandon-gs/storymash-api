import nodemailerClient from "./nodemailerClient";

const domain =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.EMAIL_HOST;

const sendActivationCode = async (
  name: string,
  email: string,
  code: string,
) => {
  const link = `${domain}/activation?code=${code}`;
  await nodemailerClient.sendMail({
    from: `"Storymash" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Storymash - Activar Cuenta",
    text: "Hello world?",
    html: `<div><h4>Hello ${name}👋,</h4></div>
        <div>
        <p>We are glad to have you in the Storymash comunity!</p>
        <p>In order to confirm your registration, we kindly ask you to activate your account by clicking on the link below:</p>
        </div>
        <div><a href='${link}' alt="activation link">${link}</a></div>`,
  });
};

export default sendActivationCode;
