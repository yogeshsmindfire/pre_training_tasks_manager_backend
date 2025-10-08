import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  authorId: { type: String, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: String, required: true },
});

const taskModel = mongoose.model('tasks', taskSchema);
export default taskModel;