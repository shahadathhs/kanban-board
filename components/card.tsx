"use client"

import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { CardType, KanbanBoard } from "./kanban-board"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskBoard } from "./task-board"

// Define types for nested tasks
export type TaskCardType = {
  id: string
  content: string
  description?: string
}

export type TaskColumnType = {
  id: string
  title: string
  cards: TaskCardType[]
}

interface CardProps {
  card: CardType & { taskColumns?: TaskColumnType[] } // optionally extend card with taskColumns
  index: number
  columnId: string
  updateCard: (columnId: string, cardId: string, content: string, description?: string) => void
  deleteCard: (columnId: string, cardId: string) => void
}

export function Card({ card, index, columnId, updateCard, deleteCard }: CardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editContent, setEditContent] = useState(card.content)
  const [editDescription, setEditDescription] = useState(card.description || "")
  // State to toggle display of nested task board inside modal
  const [showTaskBoard, setShowTaskBoard] = useState(false)

  const handleSaveEdit = () => {
    if (!editContent.trim()) return
    updateCard(columnId, card.id, editContent, editDescription)
    setIsEditDialogOpen(false)
  }

  const handleDelete = () => {
    deleteCard(columnId, card.id)
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
            className={`p-3 mb-2 bg-white dark:bg-slate-950 rounded shadow-sm ${
              snapshot.isDragging ? "opacity-70 shadow-md" : ""
            } cursor-pointer`}
            onClick={openEditDialog}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-2">
                <h3 className="font-medium text-sm">{card.content}</h3>
                {card.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {card.description}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
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
          </div>
        )}
      </Draggable>

      {/* Modal dialog with edit fields and nested task board */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Edit fields */}
            <div className="space-y-2">
              <Input
                placeholder="Card Title"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Description (optional)"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Button to toggle nested TaskBoard inside modal */}
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => setShowTaskBoard(!showTaskBoard)}>
                {showTaskBoard ? "Hide Tasks" : "Add Task"}
              </Button>
            </div>

            {/* Nested TaskBoard */}
            {showTaskBoard && (
              <div className="mt-4 border-t pt-2">
                <TaskBoard />
              </div>
            )}

            <Button onClick={handleSaveEdit} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
