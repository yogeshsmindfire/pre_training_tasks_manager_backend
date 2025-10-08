import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/taskRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

function setupDBConnection() {
  const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}`;
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        reject(false);
      });
  });
}

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

function startServer() {
  app.get("/", (req, res) => {
    res.send("Server is up and running!");
  });

  setupDBConnection().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch(() => {
    console.error("Failed to connect to the database. Server not started.");
  });
}

startServer();
