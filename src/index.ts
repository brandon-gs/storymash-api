import dotenv from "dotenv"; // This must be at the top to allow use env variables in all files
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

import app from "./app";

const port = process.env.PORT || "5000";

app.listen(parseInt(port), () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
