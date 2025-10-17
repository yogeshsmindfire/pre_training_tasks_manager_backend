import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
   authorId: { type: String, ref: "users", required: true },
   title: { type: String, required: true },
   description: { type: String, required: true },
   dueDate: { type: String, required: true },
   completed: { type: Boolean, default: false },
});

const taskModel = mongoose.model("tasks", taskSchema);
export default taskModel;
