import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import * as middlewares from "./middlewares";
import todoRoutes from "./routes/todo.routes";
import authRoutes from "./routes/user.routes";
import MessageResponse from "./interfaces/MessageResponse";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials : true
}));
app.use(morgan("dev"));
app.use(helmet());

app.get<{}, MessageResponse>("/", (_req, res) => {
  res.json({
    message: "hello",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    message: "hello",
  });
});

app.use("/api", todoRoutes);
app.use("/auth", authRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
