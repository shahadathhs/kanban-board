"use client"

import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskBoard } from "./TaskBoard"
import type { ProjectType } from "./ProjectKanbanBoard"

interface ProjectCardProps {
  project: ProjectType
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState(project.title)
  const [description, setDescription] = useState(project.description || "")
  const [showTaskBoard, setShowTaskBoard] = useState(false)

  const saveProjectChanges = async () => {
    // Update the project via API (PUT endpoint)
    await fetch(`/api/project/${project._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    })
    setIsModalOpen(false)
  }

  const deleteProject = async () => {
    await fetch(`/api/project/${project._id}`, { method: "DELETE" })
    // Remove from UI (you might update state at the board level)
  }

  return (
    <>
      <Draggable draggableId={project._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-3 mb-2 bg-white dark:bg-slate-950 rounded shadow-sm ${
              snapshot.isDragging ? "opacity-70 shadow-md" : ""
            } cursor-pointer`}
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-2">
                <h3 className="font-medium text-sm">{project.title}</h3>
                {project.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={deleteProject}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </Draggable>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Project editing fields */}
            <div className="space-y-2">
              <Input placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Project Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Toggle nested Task Kanban board */}
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => setShowTaskBoard(!showTaskBoard)}>
                {showTaskBoard ? "Hide Task Board" : "Add Task"}
              </Button>
            </div>

            {showTaskBoard && (
              <div className="mt-4 border-t pt-2">
                {/* Pass the current project _id to load tasks */}
                <TaskBoard projectId={project._id} />
              </div>
            )}

            <Button onClick={saveProjectChanges} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
