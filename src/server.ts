import express from "express";
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/taskRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";
import dotenv from "dotenv";

dotenv.config();
export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
