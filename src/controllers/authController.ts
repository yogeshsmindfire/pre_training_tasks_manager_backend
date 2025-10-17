import { Worker } from "worker_threads";
import type { Request, Response } from "express";

interface WorkerResult {
  status: "success" | "failure";
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  payload?: any;
  message?: string;
}

export const login = (req: Request, res: Response) => {
   const worker = new Worker("./src/worker.ts");
   worker.on("message", (result: WorkerResult) => {
      const { status, payload, message } = result;
      if (status === "success") {
         res.cookie("token", payload.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
         });
         return res
            .status(200)
            .json({ message: "Logged in successfully.", user: payload.user });
      } else {
         return res.status(401).json({ message });
      }
   });

   worker.on("error", (err: Error) => {
      console.error("Worker error:", err);
      res.status(500).json({ message: "Internal server error." });
   });

   // Post the login data to the worker thread
   worker.postMessage({ type: "login", data: req.body });
};

export const register = (req: Request, res: Response) => {
   const worker = new Worker("./src/worker.ts");
   worker.on("message", (result: WorkerResult) => {
      const { status, payload, message } = result;
      if (status === "success") {
         res.cookie("token", payload.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
         });
         return res
            .status(200)
            .json({
               message: "Registeration successfull.",
               user: payload.user,
            });
      } else {
         return res.status(401).json({ message });
      }
   });

   worker.on("error", (err: Error) => {
      console.error("Worker error:", err);
      res.status(500).json({ message: "Internal server error." });
   });

   // Post the login data to the worker thread
   worker.postMessage({ type: "register", data: req.body });
};

export const logout = (req: Request, res: Response) => {
   res.clearCookie("token");
   return res.status(200).json({ message: "Logged out successfully." });
};

export const auth = (req: Request, res: Response) => {
   const worker = new Worker("./src/worker.ts");
   worker.on("message", (result: WorkerResult) => {
      const { status, payload, message } = result;
      if (status === "success") {
         res.cookie("token", payload.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
         });
         return res
            .status(200)
            .json({ message: "Logged in successfully.", user: payload.user });
      } else {
         return res.status(401).json({ message });
      }
   });

   worker.on("error", (err: Error) => {
      console.error("Worker error:", err);
      res.status(500).json({ message: "Internal server error." });
   });

   // Post the login data to the worker thread
   worker.postMessage({ type: "auth", data: req.cookies });
};

export const verify = (req: Request, res: Response) => {
   const worker = new Worker("./src/worker.ts");

   worker.on("message", (result: WorkerResult) => {
      const { status, payload, message } = result;
      if (status === "success") {
         res.cookie("token", payload.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
         });
         return res
            .status(200)
            .json({ message: "Logged in successfully.", user: payload.user });
      } else {
         return res.status(401).json({ message });
      }
   });

   worker.on("error", (err: Error) => {
      console.error("Worker error:", err);
      res.status(500).json({ message: "Internal server error." });
   });

   // Post the login data to the worker thread
   worker.postMessage({ type: "verify", data: req.body });
};