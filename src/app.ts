import "./services/passport/jwt";
import path from "path";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

import * as middlewares from "./middlewares";
import api from "./api";
import MessageResponse from "./interfaces/MessageResponse";

const app = express();

app.set("trust proxy", 1);
app.enable("trust proxy");

app.use(morgan("dev"));
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(multer({ dest: path.join(__dirname, "uploads/") }).single("image"));

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.use(middlewares.speedLimiter);
app.use("/api/v1", api);

// These middlewares should be at the end
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
