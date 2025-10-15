import express from "express";
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/taskRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();
export const app = express();
const PORT = process.env.PORT || 3000;

const corsConfig = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.debug(`Server is running on port ${PORT}`);
});
