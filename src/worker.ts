import { parentPort } from "worker_threads";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import type { IUser } from "./models/User.interface.ts";
import userModel from "./models/User.ts";
import taskModel from "./models/Task.ts";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface WorkerMessage {
  type: string;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  data: any;
}

function setupDBConnection() {
   const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}`;
   return new Promise((resolve, reject) => {
      mongoose
         .connect(DB_URI)
         .then(() => {
            resolve(true);
         })
         .catch((err) => {
            console.error("Worker MongoDB connection error:", err);
            reject(false);
         });
   });
}

setupDBConnection()
   .then(() => {
      const { sign } = jwt;
      const port = parentPort;
      if (!port) {
         console.error(
            "Worker must be run inside a Worker Thread (no parentPort)."
         );
         process.exit(1);
      }

      port.on("message", async (message: WorkerMessage) => {
         const { type, data } = message;

         try {
            let token = "";
            let result = {};
            switch (type) {
               case "auth": {
                  try {
                     const decoded = jwt.verify(data.token, JWT_SECRET) as {
                        userId: string;
                     };
                     const user = await userModel
                        .findById(decoded.userId)
                        .lean();
                     if (!user) {
                        result = {
                           status: "failure",
                           message: "User not found.",
                        };
                        break;
                     }

                     result = {
                        status: "success",
                        payload: {
                           token: data.token,
                           user: {
                              name: user.name,
                              email: user.email,
                           },
                        },
                     };
                  } catch (err) {
                     console.error(err);
                     result = { status: "failure", message: "Invalid token." };
                  }
                  break;
               }

               case "verify": {
                  try {
                     const user = (await userModel.findOne({
                        email: data.email,
                     })) as IUser;
                     if (user) {
                        result = {
                           status: "failure",
                           message: "Email already in use.",
                        };
                        break;
                     } else {
                        result = { status: "success" };
                        break;
                     }
                  } catch (err) {
                     console.error(err);
                     result = { status: "failure", message: "Invalid token." };
                  }
                  break;
               }

               case "login": {
                  const { email, password, remember } = data;
                  const user = (await userModel.findOne({ email })) as IUser;
                  if (!user) {
                     result = { status: "failure", message: "User not found." };
                     break;
                  }

                  const isMatch = await user.comparePassword(password);
                  if (!isMatch) {
                     result = {
                        status: "failure",
                        message: "Invalid credentials.",
                     };
                     break;
                  }

                  token = sign(
                     { userId: user._id },
                     JWT_SECRET,
                     !remember ? { expiresIn: "1d" } : undefined
                  );
                  result = {
                     status: "success",
                     payload: {
                        token,
                        user: {
                           name: user.name,
                           email: user.email,
                        },
                     },
                  };
                  break;
               }

               case "register": {
                  const existingUser = await userModel.findOne({
                     email: data.email,
                  });
                  if (existingUser) {
                     result = {
                        status: "failure",
                        message: "User with this email already exists.",
                     };
                     break;
                  }

                  const newUser = await userModel.create({
                     name: data.name,
                     email: data.email,
                     password: data.password,
                  });

                  token = sign(
                     { userId: newUser._id },
                     JWT_SECRET,
                     !data.remember ? { expiresIn: "1d" } : undefined
                  );

                  result = {
                     status: "success",
                     message: "User registered successfully.",
                     payload: {
                        token,
                        user: {
                           name: newUser.name,
                           email: newUser.email,
                        },
                     },
                  };
                  break;
               }

               case "logout":
                  result = { status: "success" };
                  break;

               case "fetchTasks": {
                  const tasks = await taskModel
                     .find({ authorId: data.userId })
                     .lean();
                  result = {
                     status: "success",
                     payload: {
                        tasks: tasks.map((task) => ({
                           ...task,
                           _id: task._id.toString(),
                        })),
                     },
                  };
                  break;
               }

               case "deleteTask": {
                  const deletedTask = await taskModel.findOneAndDelete({
                     _id: data.taskId,
                     authorId: data.userId,
                  });
                  if (!deletedTask) {
                     result = {
                        status: "failure",
                        message:
                           "Task not found or you do not have permission to delete it.",
                     };
                  } else {
                     result = {
                        status: "success",
                     };
                  }
                  break;
               }

               case "updateTask": {
                  if (!data.taskId) {
                     const newTask = await taskModel.create({
                        ...data.updates,
                        authorId: data.userId,
                     });
                     result = {
                        status: "success",
                        payload: newTask.toObject(),
                     };
                  } else {
                     const updatedTask = await taskModel.findOneAndUpdate(
                        { _id: data.taskId, authorId: data.userId },
                        data.updates,
                        { new: true }
                     );
                     if (!updatedTask) {
                        result = {
                           status: "failure",
                           message:
                              "Task not found or you do not have permission to update it.",
                        };
                     } else {
                        result = {
                           status: "success",
                           payload: updatedTask.toObject(),
                        };
                     }
                  }
                  break;
               }

               default:
                  result = { status: "failure", message: "Unknown task type." };
                  break;
            }

            port.postMessage(result);
         } catch (error) {
            console.error("Worker error during DB operation:", error);
            port.postMessage({
               status: "failure",
               message: "Server error occurred.",
            });
         }
      });
   })
   .catch(() => {
      console.error("Failed to connect to the database. Worker not started.");
   });