import { Worker } from "worker_threads";

const handleWorkerRequest = (req: any, res: any, taskType: any, data: any) => {
  const worker = new Worker("./src/worker.ts");

  worker.on("message", (result: any) => {
    const { status, payload, message } = result;
    if (status === "success") {
      res.status(200).json(payload);
    } else {
      res.status(404).json({ message });
    }
  });

  worker.on("error", (err: any) => {
    console.error("Worker error:", err);
    res.status(500).json({ message: "Internal server error." });
  });

  worker.postMessage({ type: taskType, data: data });
};

export const fetchTasks = (req: any, res: any) => {
  handleWorkerRequest(req, res, "fetchTasks", { userId: req.userData.userId });
};

export const deleteTask = (req: any, res: any) => {
  handleWorkerRequest(req, res, "deleteTask", {
    taskId: req.params.taskId,
    userId: req.userData.userId,
  });
};

export const updateTask = (req: any, res: any) => {
  handleWorkerRequest(req, res, "updateTask", {
    taskId: req.params.taskId,
    userId: req.userData.userId,
    updates: req.body,
  });
};
