"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Define task types
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

export function TaskBoard() {
  const [columns, setColumns] = useState<TaskColumnType[]>([])
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)

  const addTaskColumn = (title: string) => {
    if (!title.trim()) return
    const newColumn: TaskColumnType = {
      id: `task-column-${uuidv4()}`,
      title,
      cards: [],
    }
    setColumns([...columns, newColumn])
    setNewColumnTitle("")
    setIsAddColumnOpen(false)
  }

  const addTaskCard = (columnId: string, content: string, description = "") => {
    if (!content.trim()) return
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === columnId) {
          const newCard: TaskCardType = {
            id: `task-card-${uuidv4()}`,
            content,
            description,
          }
          return { ...col, cards: [...col.cards, newCard] }
        }
        return col
      })
    )
  }

  return (
    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((column) => (
          <div key={column.id} className="bg-white dark:bg-slate-700 rounded p-2 min-w-[200px]">
            <h4 className="font-semibold text-sm mb-2">{column.title}</h4>
            {column.cards.map((card) => (
              <div key={card.id} className="p-2 mb-2 bg-gray-100 dark:bg-gray-600 rounded text-xs">
                <div className="font-medium">{card.content}</div>
                {card.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-300">{card.description}</p>
                )}
              </div>
            ))}
            {/* Simple form to add a task card */}
            <div className="mt-2">
              <AddTaskCardForm onSubmit={(content, description) => addTaskCard(column.id, content, description)} />
            </div>
          </div>
        ))}
      </div>

      {/* Button & modal to add a new task column */}
      <div className="mt-4">
        <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              + Add Task Column
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task Column</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input
                placeholder="Column Title"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
              <Button onClick={() => addTaskColumn(newColumnTitle)} className="w-full">
                Add Column
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// A simple form component for adding a task card
interface AddTaskCardFormProps {
  onSubmit: (content: string, description: string) => void
}

function AddTaskCardForm({ onSubmit }: AddTaskCardFormProps) {
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const handleAdd = () => {
    onSubmit(content, description)
    setContent("")
    setDescription("")
  }

  return (
    <div className="space-y-2">
      <Input
        placeholder="Task Title"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="text-xs"
      />
      <Button onClick={handleAdd} size="sm" className="w-full">
        Add Task
      </Button>
    </div>
  )
}
