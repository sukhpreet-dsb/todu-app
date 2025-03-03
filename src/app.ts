import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";

import * as middlewares from "./middlewares";
import todoRoutes from "./routes/todo.routes";
import authRoutes from "./routes/user.routes";
import MessageResponse from "./interfaces/MessageResponse";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

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
