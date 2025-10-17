/* eslint-disable @typescript-eslint/no-explicit-any */
import { Worker } from "worker_threads";
import type { Request, Response } from "express";


const handleWorkerRequest = (req: Request, res: Response, taskType: string, data: any) => {
   const worker = new Worker("./src/worker.ts");

   worker.on("message", (result: any) => {
      const { status, payload, message } = result;
      if (status === "success") {
         res.status(200).json(payload);
      } else {
         res.status(404).json({ message });
      }
   });

   worker.on("error", (err: Error) => {
      console.error("Worker error:", err);
      res.status(500).json({ message: "Internal server error." });
   });

   worker.postMessage({ type: taskType, data: data });
};

export const fetchTasks = (req: Request, res: Response) => {
   handleWorkerRequest(req, res, "fetchTasks", { userId: (req as any).userData.userId });
};

export const deleteTask = (req: Request, res: Response) => {
   handleWorkerRequest(req, res, "deleteTask", {
      taskId: req.params.taskId,
      userId: (req as any).userData.userId,
   });
};

export const updateTask = (req: Request, res: Response) => {
   handleWorkerRequest(req, res, "updateTask", {
      taskId: req.params.taskId,
      userId: (req as any).userData.userId,
      updates: req.body,
   });
};