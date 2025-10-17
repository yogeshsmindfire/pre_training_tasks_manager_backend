import cron from "node-cron";
import nodemailer from "nodemailer";
import Task from "../models/Task.ts";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from "../models/User.ts";

import mongoose from "mongoose";
import { emailContent } from "../constants/constants.ts";
import type { IUser } from "../models/User.interface.ts";

const configOptions = {
   service: "gmail",
   auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
   },
};

// Connect to the database
const connectDB = async () => {
   try {
      const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}`;
      await mongoose.connect(DB_URI);
   } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
   }
};

const mailTransport = nodemailer.createTransport(configOptions);

const sendEmail = (to: string, subject: string, body: string) => {
   mailTransport
      .sendMail({
         from: "no-reply@example.com",
         to,
         subject,
         text: body,
      })
      .then(() => {
         console.debug(
            `${to} is notified for Due Tasks`,
            new Date().toLocaleString()
         );
      })
      .catch(console.error);
};

// Cron job to check for tasks due in 24 hours
cron.schedule("* * * * *", async () => {
   try {
      connectDB().then(async () => {
         const now = new Date();
         const twentyFourHoursFromNow =
            now.getDate() +
            1 +
            "." +
            (now.getMonth() + 1) +
            "." +
            now.getFullYear();

         const dueTasks = await Task.find({
            dueDate: twentyFourHoursFromNow,
            completed: false,
         }).populate("authorId");

         const users = new Set<string>();

         for (const task of dueTasks) {
            const user = task.authorId as unknown as IUser;
            if (user && user.email) {
               users.add(user.email);
            }
         }
         for (const email of users) {
            const subject = emailContent.subject;
            const body = emailContent.body;
            sendEmail(email, subject, body);
         }
      });
   } catch (error) {
      console.error("Error checking for due tasks:", error);
   }
});
