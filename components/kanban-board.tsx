"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { Plus } from "lucide-react"

import { Column } from "./column"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { v4 as uuidv4 } from "uuid"

// Define types for our data structure
export type CardType = {
  id: string
  content: string
  description?: string
}

export type ColumnType = {
  id: string
  title: string
  cards: CardType[]
}

export type BoardType = {
  columns: ColumnType[]
}

// Initial board data
const initialData: BoardType = {
  columns: [
    {
      id: "column-1",
      title: "To Do",
      cards: [
        {
          id: "card-1",
          content: "Create project plan",
          description: "Define project scope, timeline, and deliverables",
        },
        { id: "card-2", content: "Design wireframes", description: "Create initial wireframes for the main pages" },
        { id: "card-3", content: "Research competitors", description: "Analyze similar products in the market" },
      ],
    },
    {
      id: "column-2",
      title: "In Progress",
      cards: [
        { id: "card-4", content: "Implement authentication", description: "Set up user login and registration" },
        { id: "card-5", content: "Create database schema", description: "Design the database structure" },
      ],
    },
    {
      id: "column-3",
      title: "Done",
      cards: [
        { id: "card-6", content: "Project setup", description: "Initialize repository and project structure" },
        { id: "card-7", content: "Requirements gathering", description: "Collect and document requirements" },
      ],
    },
  ],
}

// Load board data from localStorage or use initial data
const loadBoardData = (): BoardType => {
  if (typeof window !== "undefined") {
    const savedData = localStorage.getItem("kanbanBoard")
    if (savedData) {
      try {
        return JSON.parse(savedData)
      } catch (e) {
        console.error("Failed to parse saved data:", e)
      }
    }
  }
  return initialData
}

export type ProjectCardType = {
  id: string
  content: string
  description?: string
  isExpanded: boolean
  taskColumns: TaskColumnType[]
}

export type ProjectColumnType = {
  id: string
  title: string
  cards: ProjectCardType[]
}

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

export function KanbanBoard() {
  const [board, setBoard] = useState<BoardType>(initialData)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)

  // Load data on component mount
  useEffect(() => {
    setBoard(loadBoardData())
  }, [])

  // Save board data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("kanbanBoard", JSON.stringify(board))
  }, [board])

  // Handle drag end event
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId, type } = result

    // If there's no destination, do nothing
    if (!destination) return

    // If the item was dropped in the same position, do nothing
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    // If dragging columns
    if (type === "column") {
      const newColumns = Array.from(board.columns)
      const movedColumn = newColumns.splice(source.index, 1)[0]
      newColumns.splice(destination.index, 0, movedColumn)

      setBoard({
        ...board,
        columns: newColumns,
      })
      return
    }

    // Find source and destination columns
    const sourceColumn = board.columns.find((col) => col.id === source.droppableId)
    const destColumn = board.columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // If moving within the same column
    if (sourceColumn.id === destColumn.id) {
      const newCards = Array.from(sourceColumn.cards)
      const movedCard = newCards.splice(source.index, 1)[0]
      newCards.splice(destination.index, 0, movedCard)

      const newColumn = {
        ...sourceColumn,
        cards: newCards,
      }

      const newColumns = board.columns.map((col) => (col.id === newColumn.id ? newColumn : col))

      setBoard({
        ...board,
        columns: newColumns,
      })
    } else {
      // Moving from one column to another
      const sourceCards = Array.from(sourceColumn.cards)
      const destCards = Array.from(destColumn.cards)
      const movedCard = sourceCards.splice(source.index, 1)[0]
      destCards.splice(destination.index, 0, movedCard)

      const newSourceColumn = {
        ...sourceColumn,
        cards: sourceCards,
      }

      const newDestColumn = {
        ...destColumn,
        cards: destCards,
      }

      const newColumns = board.columns.map((col) => {
        if (col.id === newSourceColumn.id) return newSourceColumn
        if (col.id === newDestColumn.id) return newDestColumn
        return col
      })

      setBoard({
        ...board,
        columns: newColumns,
      })
    }
  }

  // Add a new column
  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return

    const newColumn: ColumnType = {
      id: `column-${uuidv4()}`,
      title: newColumnTitle,
      cards: [],
    }

    setBoard({
      ...board,
      columns: [...board.columns, newColumn],
    })

    setNewColumnTitle("")
    setIsAddColumnOpen(false)
  }

  // Update column title
  const updateColumnTitle = (columnId: string, newTitle: string) => {
    const newColumns = board.columns.map((col) => {
      if (col.id === columnId) {
        return { ...col, title: newTitle }
      }
      return col
    })

    setBoard({
      ...board,
      columns: newColumns,
    })
  }

  // Delete a column
  const deleteColumn = (columnId: string) => {
    const newColumns = board.columns.filter((col) => col.id !== columnId)
    setBoard({
      ...board,
      columns: newColumns,
    })
  }

  // Add a card to a column
  const addCard = (columnId: string, content: string, description = "") => {
    const newColumns = board.columns.map((col) => {
      if (col.id === columnId) {
        const newCard: CardType = {
          id: `card-${uuidv4()}`,
          content,
          description,
        }
        return {
          ...col,
          cards: [...col.cards, newCard],
        }
      }
      return col
    })

    setBoard({
      ...board,
      columns: newColumns,
    })
  }

  // Update a card
  const updateCard = (columnId: string, cardId: string, content: string, description = "") => {
    const newColumns = board.columns.map((col) => {
      if (col.id === columnId) {
        const newCards = col.cards.map((card) => {
          if (card.id === cardId) {
            return { ...card, content, description }
          }
          return card
        })
        return { ...col, cards: newCards }
      }
      return col
    })

    setBoard({
      ...board,
      columns: newColumns,
    })
  }

  // Delete a card
  const deleteCard = (columnId: string, cardId: string) => {
    const newColumns = board.columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: col.cards.filter((card) => card.id !== cardId),
        }
      }
      return col
    })

    setBoard({
      ...board,
      columns: newColumns,
    })
  }

  return (
    <div className="overflow-x-auto pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(provided) => (
            <div className="flex gap-4" {...provided.droppableProps} ref={provided.innerRef}>
              {board.columns.map((column, index) => (
                <Column
                  key={column.id}
                  column={column}
                  index={index}
                  updateColumnTitle={updateColumnTitle}
                  deleteColumn={deleteColumn}
                  addCard={addCard}
                  updateCard={updateCard}
                  deleteCard={deleteCard}
                />
              ))}
              {provided.placeholder}

              <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-shrink-0 h-12 border-dashed border-2 w-72 mt-2 text-muted-foreground"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Column
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Column</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Input
                        placeholder="Column Title"
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddColumn} className="w-full">
                      Add Column
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

