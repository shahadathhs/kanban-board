// ContentPlannerContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

export type CardType = {
  id: string;
  content: string;
  description?: string;
};

export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
};

export type StageType = {
  id: string;
  title: string;
  columns: ColumnType[];
};

type ContentPlannerContextType = {
  stages: StageType[];
  setStages: React.Dispatch<React.SetStateAction<StageType[]>>;
};

const ContentPlannerContext = createContext<ContentPlannerContextType | undefined>(undefined);

export const ContentPlannerProvider = ({ children }: { children: ReactNode }) => {
  const [stages, setStages] = useState<StageType[]>([
    {
      id: "stage-production",
      title: "Production",
      columns: [
        { id: "col-idea", title: "Idea", cards: [] },
        { id: "col-writing", title: "Writing", cards: [] },
        { id: "col-editing", title: "Editing", cards: [] },
      ],
    },
    {
      id: "stage-postproduction",
      title: "Post Production",
      columns: [
        { id: "col-review", title: "Review", cards: [] },
        { id: "col-schedule", title: "Schedule", cards: [] },
        { id: "col-publish", title: "Publish", cards: [] },
      ],
    },
  ]);

  return (
    <ContentPlannerContext.Provider value={{ stages, setStages }}>
      {children}
    </ContentPlannerContext.Provider>
  );
};

export const useContentPlanner = () => {
  const context = useContext(ContentPlannerContext);
  if (!context) {
    throw new Error("useContentPlanner must be used within a ContentPlannerProvider");
  }
  return context;
};
