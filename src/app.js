import express, {urlencoded} from "express";
import cors from "cors";
import healthCheckRouter from "./Controllers/healthCheck.controller.js";

const app = express();

app.use(express.json({limit: "16kb"}));
app.use(urlencoded({extended: true, limit: "16kb"}));
app.use(cors({
  url: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use("/api/v1/health-check", healthCheckRouter);

export default app;