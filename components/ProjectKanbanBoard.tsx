"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";

import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// For simplicity, we assume a single-column layout here. You can extend this to support multiple columns as needed.
export type ProjectType = {
  _id: string;
  title: string;
  description?: string;
  // Optionally, store custom board columns for the project board.
  columns?: { id: string; title: string; order: number }[];
};

export function ProjectKanbanBoard() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    fetch("/api/project")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  // For drag & drop of project cards if needed
  const onDragEnd = (result: any) => {
    // Update project order based on drag result...
  };

  const addProject = async () => {
    if (!newProjectTitle.trim()) return;
    const newProject = await fetch("/api/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newProjectTitle,
        description: "",
        columns: [], // you could initialize with default columns if desired
      }),
    }).then((res) => res.json());

    setProjects([...projects, newProject]);
    setNewProjectTitle("");
    setIsAddProjectOpen(false);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="project" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {projects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={index}
                />
              ))}
              {provided.placeholder}

              <Dialog
                open={isAddProjectOpen}
                onOpenChange={setIsAddProjectOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-shrink-0 h-12 border-dashed border-2 w-72 mt-2 text-muted-foreground"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Input
                        placeholder="Project Title"
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                      />
                    </div>
                    <Button onClick={addProject} className="w-full">
                      Add Project
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
