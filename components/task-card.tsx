import { useState } from "react";
import { TaskCardType } from "./task-board";
import { Draggable } from "@hello-pangea/dnd";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface TaskCardProps {
  card: TaskCardType;
  index: number;
  columnId: string;
  updateCard: (
    columnId: string,
    cardId: string,
    content: string,
    description?: string
  ) => void;
  deleteCard: (columnId: string, cardId: string) => void;
}

export function TaskCard({ card, index, columnId, updateCard, deleteCard }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(card.content);
  const [editDescription, setEditDescription] = useState(card.description || "");

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;
    updateCard(columnId, card.id, editContent, editDescription);
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    deleteCard(columnId, card.id);
  };

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-2 bg-gray-100 dark:bg-gray-600 rounded text-xs mb-2 cursor-pointer ${
              snapshot.isDragging ? "opacity-70" : ""
            }`}
            onClick={() => setIsEditDialogOpen(true)}
          >
            <div className="font-medium">{card.content}</div>
            {card.description && (
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {card.description}
              </p>
            )}
          </div>
        )}
      </Draggable>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="Task Title"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <Textarea
              placeholder="Description (optional)"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="text-xs"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                Delete
              </Button>
              <Button onClick={handleSaveEdit} size="sm">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
