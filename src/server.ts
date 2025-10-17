import express from "express";
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/taskRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";
import dotenv from "dotenv";
import cors from "cors";
import "./cron/taskNotifier.ts";

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;

const corsConfig = {
   origin: process.env.REQUEST_ORIGIN,
   credentials: true,
   methods: ["GET", "POST", "PUT", "DELETE"],
   allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
   console.debug(`Server is running on port ${PORT}`);
});
