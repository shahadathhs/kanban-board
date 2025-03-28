"use client"

import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { CardType } from "./kanban-board"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskBoard } from "./task-board"

interface CardProps {
  card: CardType & { taskColumns?: TaskColumnType[] } // optionally extend card with taskColumns
  index: number
  columnId: string
  updateCard: (columnId: string, cardId: string, content: string, description?: string) => void
  deleteCard: (columnId: string, cardId: string) => void
}

// Define types for nested tasks (if not defined elsewhere)
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

export function Card({ card, index, columnId, updateCard, deleteCard }: CardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editContent, setEditContent] = useState(card.content)
  const [editDescription, setEditDescription] = useState(card.description || "")
  // State to toggle display of nested task board
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
            }`}
          >
            <div className="flex justify-between items-start">
              {/* Card main content is clickable to open the edit modal */}
              <div
                className="flex-1 mr-2 cursor-pointer"
                onClick={openEditDialog}
              >
                <h3 className="font-medium text-sm">{card.content}</h3>
                {card.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {card.description}
                  </p>
                )}
              </div>

              {/* Dropdown menu with stopPropagation */}
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

            {/* Button to toggle nested task board */}
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => setShowTaskBoard(!showTaskBoard)}>
                {showTaskBoard ? "Hide Tasks" : "Add Task"}
              </Button>
            </div>

            {/* Nested task board - rendered if showTaskBoard is true */}
            {showTaskBoard && (
              <div className="mt-4 border-t pt-2">
                <TaskBoard />
              </div>
            )}
          </div>
        )}
      </Draggable>

      {/* Edit modal dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Input placeholder="Card Title" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
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
