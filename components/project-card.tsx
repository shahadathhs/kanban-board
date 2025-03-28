"use client"

import type React from "react"

import { useState } from "react"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import { ChevronDown, ChevronRight, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"

import { TaskCard } from "./task-card"
import type { ProjectCardType } from "./kanban-board"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectCardProps {
  card: ProjectCardType
  index: number
  columnId: string
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

export function ProjectCard({
  card,
  index,
  columnId,
  updateProjectCard,
  deleteProjectCard,
  toggleProjectExpansion,
  addTaskColumn,
  updateTaskColumnTitle,
  deleteTaskColumn,
  addTaskCard,
  updateTaskCard,
  deleteTaskCard,
}: ProjectCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editContent, setEditContent] = useState(card.content)
  const [editDescription, setEditDescription] = useState(card.description || "")
  const [isAddTaskColumnOpen, setIsAddTaskColumnOpen] = useState(false)
  const [newTaskColumnTitle, setNewTaskColumnTitle] = useState("")

  const handleSaveEdit = () => {
    if (!editContent.trim()) return
    updateProjectCard(columnId, card.id, editContent, editDescription)
    setIsEditDialogOpen(false)
  }

  const handleDelete = () => {
    deleteProjectCard(columnId, card.id)
  }

  const openEditDialog = () => {
    setEditContent(card.content)
    setEditDescription(card.description || "")
    setIsEditDialogOpen(true)
  }

  const handleAddTaskColumn = () => {
    if (!newTaskColumnTitle.trim()) return
    addTaskColumn(card.id, newTaskColumnTitle)
    setNewTaskColumnTitle("")
    setIsAddTaskColumnOpen(false)
  }

  // Calculate total tasks across all columns
  const totalTasks = card.taskColumns.reduce((sum, column) => sum + column.cards.length, 0)

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-2 ${snapshot.isDragging ? "opacity-70" : ""}`}
          >
            <div className="p-3 bg-white dark:bg-slate-950 rounded shadow-sm">
              <div className="flex justify-between items-start">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleProjectExpansion(columnId, card.id)}
                >
                  {card.isExpanded ? (
                    <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{card.content}</h3>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={openEditDialog}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {card.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-5">{card.description}</p>
              )}

              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-5">Tasks: {totalTasks}</div>
            </div>

            {card.isExpanded && (
              <div className="mt-2 ml-5 mr-2 mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium">Tasks</h4>
                  <Dialog open={isAddTaskColumnOpen} onOpenChange={setIsAddTaskColumnOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add Column
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Task Column</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Input
                            placeholder="Column Title"
                            value={newTaskColumnTitle}
                            onChange={(e) => setNewTaskColumnTitle(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleAddTaskColumn} className="w-full">
                          Add Column
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="overflow-x-auto">
                  <Droppable
                    droppableId={`task-columns-${card.id}`}
                    type={`taskColumn-${card.id}`}
                    direction="horizontal"
                  >
                    {(provided) => (
                      <div className="flex gap-3 pb-2" ref={provided.innerRef} {...provided.droppableProps}>
                        {card.taskColumns.map((taskColumn, columnIndex) => (
                          <Draggable key={taskColumn.id} draggableId={taskColumn.id} index={columnIndex}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="bg-slate-100 dark:bg-slate-800 rounded min-w-[200px] w-[200px] flex-shrink-0"
                              >
                                <div
                                  className="p-2 font-medium flex items-center justify-between border-b border-slate-200 dark:border-slate-700"
                                  {...provided.dragHandleProps}
                                >
                                  <TaskColumnHeader
                                    projectId={card.id}
                                    taskColumn={taskColumn}
                                    updateTaskColumnTitle={updateTaskColumnTitle}
                                    deleteTaskColumn={deleteTaskColumn}
                                  />
                                </div>

                                <Droppable droppableId={taskColumn.id} type={`taskCard-${card.id}`}>
                                  {(provided, snapshot) => (
                                    <div
                                      className={`p-1 min-h-[50px] ${
                                        snapshot.isDraggingOver ? "bg-slate-200 dark:bg-slate-700" : ""
                                      }`}
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                    >
                                      {taskColumn.cards.map((taskCard, taskIndex) => (
                                        <TaskCard
                                          key={taskCard.id}
                                          card={taskCard}
                                          index={taskIndex}
                                          projectId={card.id}
                                          columnId={taskColumn.id}
                                          updateTaskCard={updateTaskCard}
                                          deleteTaskCard={deleteTaskCard}
                                        />
                                      ))}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>

                                <AddTaskButton projectId={card.id} columnId={taskColumn.id} addTaskCard={addTaskCard} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            )}
          </div>
        )}
      </Draggable>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Input placeholder="Project Title" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Description (optional)"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={handleSaveEdit} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Task Column Header Component
function TaskColumnHeader({
  projectId,
  taskColumn,
  updateTaskColumnTitle,
  deleteTaskColumn,
}: {
  projectId: string
  taskColumn: { id: string; title: string }
  updateTaskColumnTitle: (projectId: string, taskColumnId: string, newTitle: string) => void
  deleteTaskColumn: (projectId: string, taskColumnId: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(taskColumn.title)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    if (title.trim()) {
      updateTaskColumnTitle(projectId, taskColumn.id, title)
    } else {
      setTitle(taskColumn.title) // Reset to original if empty
    }
    setIsEditing(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (title.trim()) {
        updateTaskColumnTitle(projectId, taskColumn.id, title)
      } else {
        setTitle(taskColumn.title) // Reset to original if empty
      }
      setIsEditing(false)
    }
  }

  return (
    <>
      {isEditing ? (
        <Input
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          className="h-6 py-0 text-xs"
          autoFocus
        />
      ) : (
        <div className="flex justify-between items-center w-full">
          <span className="text-xs font-medium truncate cursor-pointer" onClick={() => setIsEditing(true)}>
            {taskColumn.title}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>Rename</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => deleteTaskColumn(projectId, taskColumn.id)}>
                <Trash2 className="h-3 w-3 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  )
}

// Add Task Button Component
function AddTaskButton({
  projectId,
  columnId,
  addTaskCard,
}: {
  projectId: string
  columnId: string
  addTaskCard: (projectId: string, taskColumnId: string, content: string, description?: string) => void
}) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [taskContent, setTaskContent] = useState("")
  const [taskDescription, setTaskDescription] = useState("")

  const handleAddTask = () => {
    if (!taskContent.trim()) return

    addTaskCard(projectId, columnId, taskContent, taskDescription)
    setTaskContent("")
    setTaskDescription("")
    setIsAddTaskOpen(false)
  }

  return (
    <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground justify-start p-2 h-auto">
          <Plus className="h-3 w-3 mr-1" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Input placeholder="Task Title" value={taskContent} onChange={(e) => setTaskContent(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Description (optional)"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button onClick={handleAddTask} className="w-full">
            Add Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

