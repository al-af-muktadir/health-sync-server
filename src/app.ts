import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRoute } from "./app/modules/User/User.route";
import router from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHanlder";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
const app: Application = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://health-sync-client.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFound);
export default app;
