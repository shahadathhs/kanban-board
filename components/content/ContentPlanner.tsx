// ContentPlanner.tsx
"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useContentPlanner,
  StageType,
  ColumnType,
} from "./ContentPlannerContext";
import StageBoard from "./StageBoard";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function ContentPlanner() {
  const { stages, setStages } = useContentPlanner();
  const [newStageTitle, setNewStageTitle] = useState("");
  const [isAddStageOpen, setIsAddStageOpen] = useState(false);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;

    // Handle stage reordering
    if (type === "stage") {
      const newStages = Array.from(stages);
      const [movedStage] = newStages.splice(source.index, 1);
      newStages.splice(destination.index, 0, movedStage);
      setStages(newStages);
      return;
    }

    // Handle column reordering within a stage
    if (type === "column") {
      // droppableId format: `${stageId}:columns`
      const stageId = source.droppableId.split(":")[0];
      const stageIndex = stages.findIndex((s) => s.id === stageId);
      if (stageIndex === -1) return;

      const stage = stages[stageIndex];
      const newColumns = Array.from(stage.columns);
      const [movedColumn] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, movedColumn);

      const updatedStage = { ...stage, columns: newColumns };
      const updatedStages = stages.map((s) =>
        s.id === updatedStage.id ? updatedStage : s
      );
      setStages(updatedStages);
      return;
    }

    // Handle moving project cards between columns (could be in same or different stage)
    // droppableId format: `${stageId}:${columnId}`
    const [sourceStageId, sourceColumnId] = source.droppableId.split(":");
    const [destStageId, destColumnId] = destination.droppableId.split(":");
    if (!sourceStageId || !sourceColumnId || !destStageId || !destColumnId)
      return;

    const sourceStageIndex = stages.findIndex((s) => s.id === sourceStageId);
    const destStageIndex = stages.findIndex((s) => s.id === destStageId);
    if (sourceStageIndex === -1 || destStageIndex === -1) return;

    const sourceStage = stages[sourceStageIndex];
    const destStage = stages[destStageIndex];

    const sourceColumnIndex = sourceStage.columns.findIndex(
      (col) => col.id === sourceColumnId
    );
    const destColumnIndex = destStage.columns.findIndex(
      (col) => col.id === destColumnId
    );
    if (sourceColumnIndex === -1 || destColumnIndex === -1) return;

    const sourceColumn = sourceStage.columns[sourceColumnIndex];
    const destColumn = destStage.columns[destColumnIndex];

    const newSourceCards = Array.from(sourceColumn.cards);
    const [movedCard] = newSourceCards.splice(source.index, 1);

    const newDestCards = Array.from(destColumn.cards);
    newDestCards.splice(destination.index, 0, movedCard);

    const updatedSourceColumn: ColumnType = {
      ...sourceColumn,
      cards: newSourceCards,
    };
    const updatedDestColumn: ColumnType = {
      ...destColumn,
      cards: newDestCards,
    };

    const updatedStages = stages.map((stage) => {
      if (stage.id === sourceStage.id) {
        return {
          ...stage,
          columns: stage.columns.map((col) =>
            col.id === updatedSourceColumn.id ? updatedSourceColumn : col
          ),
        };
      }
      if (stage.id === destStage.id) {
        return {
          ...stage,
          columns: stage.columns.map((col) =>
            col.id === updatedDestColumn.id ? updatedDestColumn : col
          ),
        };
      }
      return stage;
    });

    setStages(updatedStages);
  };

  const addStage = () => {
    if (!newStageTitle.trim()) return;
    const newStage: StageType = {
      id: `stage-${uuidv4()}`,
      title: newStageTitle,
      // New stage gets default two columns
      columns: [
        { id: `col-${uuidv4()}`, title: "New Column 1", cards: [] },
        { id: `col-${uuidv4()}`, title: "New Column 2", cards: [] },
      ],
    };
    setStages([...stages, newStage]);
    setNewStageTitle("");
    setIsAddStageOpen(false);
  };

  return (
    <div className="p-4 space-y-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="stages" type="stage" direction="vertical">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-6"
            >
              {stages.map((stage, index) => (
                <Draggable key={stage.id} draggableId={stage.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="border rounded-lg p-4 bg-white dark:bg-slate-800"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="text-2xl font-bold mb-4"
                      >
                        {stage.title}
                      </div>
                      <StageBoard stage={stage} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <Dialog open={isAddStageOpen} onOpenChange={setIsAddStageOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-dashed"
                  >
                    + Add Stage
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Stage</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <Input
                      placeholder="Stage Title"
                      value={newStageTitle}
                      onChange={(e) => setNewStageTitle(e.target.value)}
                    />
                    <Button onClick={addStage} className="w-full">
                      Add Stage
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
