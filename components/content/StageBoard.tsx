// StageBoard.tsx
"use client";

import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { StageType, ColumnType } from "./ContentPlannerContext";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StageBoardProps {
  stage: StageType;
}

export default function StageBoard({ stage }: StageBoardProps) {
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  // NOTE: In a full implementation, updating columns is done via context.
  // Here, we only log the action.
  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    console.log("Add column", newColumnTitle, "to stage", stage.id);
    // Here you would update the global state for the stage's columns.
    setNewColumnTitle("");
    setIsAddColumnOpen(false);
  };

  return (
    <div>
      {/* Droppable for columns with type "column" */}
      <Droppable droppableId={`${stage.id}:columns`} type="column" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex gap-4 overflow-x-auto ${
              snapshot.isDraggingOver ? "bg-slate-200" : ""
            }`}
          >
            {stage.columns.map((column, index) => (
              <Draggable key={column.id} draggableId={column.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`w-72 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 ${
                      snapshot.isDragging ? "opacity-70" : ""
                    }`}
                  >
                    {/* Column header with drag handle */}
                    <div {...provided.dragHandleProps} className="font-semibold text-lg mb-2">
                      {column.title}
                    </div>
                    {/* Nested droppable for project cards */}
                    <Droppable
                      droppableId={`${stage.id}:${column.id}`}
                      type="project"
                      direction="vertical"
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[100px] ${snapshot.isDraggingOver ? "bg-slate-300" : ""}`}
                        >
                          {column.cards.map((card, cardIndex) => (
                            <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-2 mb-2 bg-white rounded shadow ${
                                    snapshot.isDragging ? "opacity-70" : ""
                                  }`}
                                >
                                  {card.content}
                                  {/* Optionally, add a nested TaskBoard button here */}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    {/* Optionally, include an inline form or button to open a dialog for adding a project card */}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-shrink-0 h-12 border-dashed w-72 mt-2">
                  + Add Column
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
    </div>
  );
}
