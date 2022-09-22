declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      // Database
      MONGO_URI: string;
      // Email service
      EMAIL_SERVICE: string;
      EMAIL_USER: string;
      EMAIL_PASSWORD: string;
      EMAIL_HOST: string;
      // OAUTH
      OAUTH_CLIENT_ID: string;
      OAUTH_CLIENT_SECRET: string;
      OAUTH_REFRESH_TOKEN: string;
      // Resources
      USER_MALE_IMAGE_URL: string;
      USER_FEMALE_IMAGE_URL: string;
      USER_NO_GENDER_IMAGE_URL: string;
      // Jwt
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      ACCESS_EXP: string;
      REFRESH_EXP: string;
      // COOKIES
      COOKIE_ACCESS_NAME: string;
      COOKIE_REFRESH_NAME: string;
    }
  }
}

export default {};
