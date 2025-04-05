// TaskBoard.tsx
"use client";

import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { ColumnType, CardType } from "./ContentPlannerContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";

interface TaskBoardProps {
  column: ColumnType;
  stageId: string;
}

export default function TaskBoard({ column, stageId }: TaskBoardProps) {
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  // In a full implementation, addTask would update global state.
  const addTask = () => {
    if (!newTaskContent.trim()) return;
    console.log("Add task", newTaskContent, "to column", column.id, "in stage", stageId);
    setNewTaskContent("");
    setNewTaskDescription("");
  };

  return (
    <div className="mt-4">
      <Droppable
        droppableId={`${stageId}:${column.id}:task`}
        direction="vertical"
        type="task"
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-2 rounded bg-gray-100 ${snapshot.isDraggingOver ? "bg-gray-200" : ""}`}
          >
            {column.cards.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-2 mb-2 bg-white rounded shadow ${
                      snapshot.isDragging ? "opacity-70" : ""
                    }`}
                  >
                    {task.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="mt-2 space-y-2">
        <Input
          placeholder="Task Title"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
        />
        <Textarea
          placeholder="Description (optional)"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          rows={2}
        />
        <Button onClick={addTask} className="w-full">
          Add Task
        </Button>
      </div>
    </div>
  );
}
