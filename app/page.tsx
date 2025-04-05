import ContentPlanner from "@/components/content/ContentPlanner";
import { ContentPlannerProvider } from "@/components/content/ContentPlannerContext";
import { ProjectBoard } from "@/components/kanban/project-board";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-slate-900 dark:text-slate-50">
          Multi-Level Kanban Board
        </h1>
        <ProjectBoard />
      </div>
      <ContentPlannerProvider>
        <ContentPlanner />
      </ContentPlannerProvider>
    </div>
  );
}
