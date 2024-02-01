import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import path from "path";
// import { fileURLToPath } from "url";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
    cors({
        origin: process.env.CORS_OROGIN,
        credentials: true,
    })
);
app.use(cookieParser());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "../../Client/dist")));

// Routes import...
import { userRouter } from "./routes/user.routes.js";

// Routes declaration...
app.use("/api/v1/user", userRouter);

export default app;
