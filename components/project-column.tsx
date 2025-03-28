"use client"

import type React from "react"

import { useState } from "react"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import { MoreHorizontal, Plus, Trash2 } from "lucide-react"

import { ProjectCard } from "./project-card"
import type { ProjectColumnType } from "./kanban-board"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectColumnProps {
  column: ProjectColumnType
  index: number
  updateColumnTitle: (columnId: string, newTitle: string) => void
  deleteColumn: (columnId: string) => void
  addProjectCard: (columnId: string, content: string, description?: string) => void
  updateProjectCard: (columnId: string, cardId: string, content: string, description?: string) => void
  deleteProjectCard: (columnId: string, cardId: string) => void
  toggleProjectExpansion: (columnId: string, cardId: string) => void
  addTaskColumn: (projectId: string, title: string) => void
  updateTaskColumnTitle: (projectId: string, taskColumnId: string, newTitle: string) => void
  deleteTaskColumn: (projectId: string, taskColumnId: string) => void
  addTaskCard: (projectId: string, taskColumnId: string, content: string, description?: string) => void
  updateTaskCard: (
    projectId: string,
    taskColumnId: string,
    taskCardId: string,
    content: string,
    description?: string,
  ) => void
  deleteTaskCard: (projectId: string, taskColumnId: string, taskCardId: string) => void
}

export function ProjectColumn({
  column,
  index,
  updateColumnTitle,
  deleteColumn,
  addProjectCard,
  updateProjectCard,
  deleteProjectCard,
  toggleProjectExpansion,
  addTaskColumn,
  updateTaskColumnTitle,
  deleteTaskColumn,
  addTaskCard,
  updateTaskCard,
  deleteTaskCard,
}: ProjectColumnProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [columnTitle, setColumnTitle] = useState(column.title)
  const [isAddCardOpen, setIsAddCardOpen] = useState(false)
  const [newCardContent, setNewCardContent] = useState("")
  const [newCardDescription, setNewCardDescription] = useState("")

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumnTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    if (columnTitle.trim()) {
      updateColumnTitle(column.id, columnTitle)
    } else {
      setColumnTitle(column.title) // Reset to original if empty
    }
    setIsEditing(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (columnTitle.trim()) {
        updateColumnTitle(column.id, columnTitle)
      } else {
        setColumnTitle(column.title) // Reset to original if empty
      }
      setIsEditing(false)
    }
  }

  const handleAddCard = () => {
    if (!newCardContent.trim()) return

    addProjectCard(column.id, newCardContent, newCardDescription)
    setNewCardContent("")
    setNewCardDescription("")
    setIsAddCardOpen(false)
  }

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="bg-slate-100 dark:bg-slate-800 rounded-lg w-72 flex-shrink-0 flex flex-col max-h-[calc(100vh-10rem)] shadow-sm"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="p-3 font-medium flex items-center justify-between" {...provided.dragHandleProps}>
            {isEditing ? (
              <Input
                value={columnTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="h-7 py-1"
                autoFocus
              />
            ) : (
              <div className="text-sm font-semibold truncate cursor-pointer" onClick={() => setIsEditing(true)}>
                {column.title} ({column.cards.length})
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>Rename</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => deleteColumn(column.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Droppable droppableId={column.id} type="card">
            {(provided, snapshot) => (
              <div
                className={`flex-grow overflow-y-auto p-2 ${
                  snapshot.isDraggingOver ? "bg-slate-200 dark:bg-slate-700" : ""
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {column.cards.map((card, index) => (
                  <ProjectCard
                    key={card.id}
                    card={card}
                    index={index}
                    columnId={column.id}
                    updateProjectCard={updateProjectCard}
                    deleteProjectCard={deleteProjectCard}
                    toggleProjectExpansion={toggleProjectExpansion}
                    addTaskColumn={addTaskColumn}
                    updateTaskColumnTitle={updateTaskColumnTitle}
                    deleteTaskColumn={deleteTaskColumn}
                    addTaskCard={addTaskCard}
                    updateTaskCard={updateTaskCard}
                    deleteTaskCard={deleteTaskCard}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex m-2 text-muted-foreground justify-start">
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
                    value={newCardContent}
                    onChange={(e) => setNewCardContent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Description (optional)"
                    value={newCardDescription}
                    onChange={(e) => setNewCardDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddCard} className="w-full">
                  Add Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Draggable>
  )
}

