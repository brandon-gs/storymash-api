import "dotenv/config"; // This must be at the top to allow use env variables in all files

import app from "./app";

const port = process.env.PORT || "5000";

app.listen(parseInt(port), "0.0.0.0", () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
