import express, {urlencoded} from "express";
import cors from "cors";

const app = express();

app.use(express.json({limit: "16kb"}));
app.use(urlencoded({extended: true, limit: "16kb"}));
app.use(cors({
  url: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use("/", (req, res) => {
  res.send("Hello");
});

export default app;