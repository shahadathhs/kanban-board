import mongoose from "mongoose";

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Project {
  title: string;
  description?: string;
  columns: Column[];
}

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  columns: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      order: { type: Number, default: 0 },
    },
  ],
});

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
