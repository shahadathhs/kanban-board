import mongoose from "mongoose";

export interface Task {
  projectId: string;
  content: string;
  description?: string;
  columnId: string;
}

const TaskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  content: { type: String, required: true },
  description: { type: String },
  columnId: { type: String, required: true },
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
