"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskCard } from "./task-card";

// ----------
// Types for Task Board
// ----------

export type TaskCardType = {
  id: string;
  content: string;
  description?: string;
};

export type TaskColumnType = {
  id: string;
  title: string;
  cards: TaskCardType[];
};

export type TaskBoardType = {
  columns: TaskColumnType[];
};

// ----------
// Initial Task Board Data
// ----------

const initialTaskBoard: TaskBoardType = {
  columns: [
    {
      id: "task-column-1",
      title: "To Do",
      cards: [
        {
          id: "task-card-1",
          content: "Define task requirements",
          description: "Outline requirements and acceptance criteria",
        },
      ],
    },
    {
      id: "task-column-2",
      title: "In Progress",
      cards: [
        {
          id: "task-card-2",
          content: "Develop feature X",
          description: "Implement drag & drop and editing",
        },
      ],
    },
    {
      id: "task-column-3",
      title: "Done",
      cards: [
        {
          id: "task-card-3",
          content: "Code review",
          description: "Review code for consistency and bugs",
        },
      ],
    },
  ],
};

// ----------
// TaskBoard Component
// ----------

export function TaskBoard() {
  const [board, setBoard] = useState<TaskBoardType>(initialTaskBoard);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  // Load board data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("TaskBoard");
    if (saved) {
      try {
        setBoard(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved TaskBoard data:", e);
      }
    }
  }, []);

  // Save board data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("TaskBoard", JSON.stringify(board));
  }, [board]);

  // ---------- Drag and Drop Handler ----------

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Moving columns
    if (type === "column") {
      const newColumns = Array.from(board.columns);
      const [movedColumn] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, movedColumn);
      setBoard({ ...board, columns: newColumns });
      return;
    }

    // Find source and destination columns
    const sourceColumn = board.columns.find(
      (col) => col.id === source.droppableId
    );
    const destColumn = board.columns.find(
      (col) => col.id === destination.droppableId
    );
    if (!sourceColumn || !destColumn) return;

    // Moving within the same column
    if (sourceColumn.id === destColumn.id) {
      const newCards = Array.from(sourceColumn.cards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);
      const updatedColumn = { ...sourceColumn, cards: newCards };
      setBoard({
        ...board,
        columns: board.columns.map((col) =>
          col.id === updatedColumn.id ? updatedColumn : col
        ),
      });
    } else {
      // Moving from one column to another
      const sourceCards = Array.from(sourceColumn.cards);
      const destCards = Array.from(destColumn.cards);
      const [movedCard] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, movedCard);
      const updatedSource = { ...sourceColumn, cards: sourceCards };
      const updatedDest = { ...destColumn, cards: destCards };
      setBoard({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === updatedSource.id) return updatedSource;
          if (col.id === updatedDest.id) return updatedDest;
          return col;
        }),
      });
    }
  };

  // ---------- Column Operations ----------

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    const newColumn: TaskColumnType = {
      id: `task-column-${uuidv4()}`,
      title: newColumnTitle,
      cards: [],
    };
    setBoard({ ...board, columns: [...board.columns, newColumn] });
    setNewColumnTitle("");
    setIsAddColumnOpen(false);
  };

  const updateColumnTitle = (columnId: string, newTitle: string) => {
    const newColumns = board.columns.map((col) =>
      col.id === columnId ? { ...col, title: newTitle } : col
    );
    setBoard({ ...board, columns: newColumns });
  };

  const deleteColumn = (columnId: string) => {
    const newColumns = board.columns.filter((col) => col.id !== columnId);
    setBoard({ ...board, columns: newColumns });
  };

  // ---------- Card Operations ----------

  const addCard = (
    columnId: string,
    content: string,
    description: string = ""
  ) => {
    const newColumns = board.columns.map((col) => {
      if (col.id === columnId) {
        const newCard: TaskCardType = {
          id: `task-card-${uuidv4()}`,
          content,
          description,
        };
        return { ...col, cards: [...col.cards, newCard] };
      }
      return col;
    });
    setBoard({ ...board, columns: newColumns });
  };

  const updateCard = (
    columnId: string,
    cardId: string,
    content: string,
    description: string = ""
  ) => {
    const newColumns = board.columns.map((col) => {
      if (col.id === columnId) {
        const newCards = col.cards.map((card) =>
          card.id === cardId ? { ...card, content, description } : card
        );
        return { ...col, cards: newCards };
      }
      return col;
    });
    setBoard({ ...board, columns: newColumns });
  };

  const deleteCard = (columnId: string, cardId: string) => {
    const newColumns = board.columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: col.cards.filter((card) => card.id !== cardId),
        };
      }
      return col;
    });
    setBoard({ ...board, columns: newColumns });
  };

  // ---------- Render TaskBoard ----------

  return (
    <div className="overflow-x-auto pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="task-board"
          type="column"
          direction="horizontal"
        >
          {(provided) => (
            <div
              className="flex gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {board.columns.map((column, index) => (
                <TaskColumn
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
              {/* Button to add a new Task Column */}
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
                    <Input
                      placeholder="Column Title"
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                    />
                    <Button onClick={addColumn} className="w-full">
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
  );
}

// ----------
// TaskColumn Component (similar to your ProjectBoard's Column)
// ----------

interface TaskColumnProps {
  column: TaskColumnType;
  index: number;
  updateColumnTitle: (columnId: string, newTitle: string) => void;
  deleteColumn: (columnId: string) => void;
  addCard: (columnId: string, content: string, description?: string) => void;
  updateCard: (
    columnId: string,
    cardId: string,
    content: string,
    description?: string
  ) => void;
  deleteCard: (columnId: string, cardId: string) => void;
}

function TaskColumn({
  column,
  index,
  updateColumnTitle,
  deleteColumn,
  addCard,
  updateCard,
  deleteCard,
}: TaskColumnProps) {
  const [newCardContent, setNewCardContent] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [isEditColumnOpen, setIsEditColumnOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleAddCard = () => {
    if (!newCardContent.trim()) return;
    addCard(column.id, newCardContent, newCardDescription);
    setNewCardContent("");
    setNewCardDescription("");
  };

  const handleUpdateColumnTitle = () => {
    if (!editedTitle.trim()) return;
    updateColumnTitle(column.id, editedTitle);
    setIsEditColumnOpen(false);
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="bg-white dark:bg-slate-700 rounded p-2 min-w-[250px]"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className="flex justify-between items-center mb-2"
            {...provided.dragHandleProps}
          >
            {isEditColumnOpen ? (
              <>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <Button onClick={handleUpdateColumnTitle} size="sm">
                  Save
                </Button>
              </>
            ) : (
              <>
                <h4 className="font-semibold text-sm">{column.title}</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditColumnOpen(true)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Title
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => deleteColumn(column.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Column
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          <Droppable droppableId={column.id} type="card">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2 mb-2"
              >
                {column.cards.map((card, index) => (
                  <TaskCard
                    key={card.id}
                    card={card}
                    index={index}
                    columnId={column.id}
                    updateCard={updateCard}
                    deleteCard={deleteCard}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Inline form to add a new Task Card */}
          <div className="space-y-2">
            <Input
              placeholder="Task Title"
              value={newCardContent}
              onChange={(e) => setNewCardContent(e.target.value)}
            />
            <Textarea
              placeholder="Description (optional)"
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
              rows={2}
              className="text-xs"
            />
            <Button onClick={handleAddCard} size="sm" className="w-full">
              Add Task
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
