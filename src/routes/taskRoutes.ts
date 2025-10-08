import express from "express";
import {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/taskController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
const router = express.Router();

router.use(authMiddleware);

router.get("/", fetchTasks);
router.delete("/:taskId", deleteTask);
router.post("/", createTask);
router.put("/:taskId", updateTask);

export default router;
