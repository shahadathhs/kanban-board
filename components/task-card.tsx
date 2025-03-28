"use client"

import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import type { TaskCardType } from "./kanban-board"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TaskCardProps {
  card: TaskCardType
  index: number
  projectId: string
  columnId: string
  updateTaskCard: (
    projectId: string,
    taskColumnId: string,
    taskCardId: string,
    content: string,
    description?: string,
  ) => void
  deleteTaskCard: (projectId: string, taskColumnId: string, taskCardId: string) => void
}

export function TaskCard({ card, index, projectId, columnId, updateTaskCard, deleteTaskCard }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editContent, setEditContent] = useState(card.content)
  const [editDescription, setEditDescription] = useState(card.description || "")

  const handleSaveEdit = () => {
    if (!editContent.trim()) return
    updateTaskCard(projectId, columnId, card.id, editContent, editDescription)
    setIsEditDialogOpen(false)
  }

  const handleDelete = () => {
    deleteTaskCard(projectId, columnId, card.id)
  }

  const openEditDialog = () => {
    setEditContent(card.content)
    setEditDescription(card.description || "")
    setIsEditDialogOpen(true)
  }

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-2 mb-1 bg-white dark:bg-slate-950 rounded shadow-sm text-xs ${
              snapshot.isDragging ? "opacity-70" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-1">
                <h3 className="font-medium">{card.content}</h3>
                {card.description && (
                  <p className="text-slate-500 dark:text-slate-400 mt-1 text-[10px] line-clamp-2">{card.description}</p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={openEditDialog}>
                    <Pencil className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </Draggable>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Input placeholder="Task Title" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
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

