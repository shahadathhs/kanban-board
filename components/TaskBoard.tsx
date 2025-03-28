// components/TaskBoard.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export type TaskType = {
  _id: string
  projectId: string
  content: string
  description?: string
  columnId: string
}

interface TaskBoardProps {
  projectId: string
}

export function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<TaskType[]>([])
  const [newTaskContent, setNewTaskContent] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  
  // For a multi‑status board, you can hardcode default columns.
  const defaultColumns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" }
  ]

  // Fetch tasks for the project
  useEffect(() => {
    fetch(`/api/task?projectId=${projectId}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
  }, [projectId])

  const addTask = async () => {
    if (!newTaskContent.trim()) return
    // For simplicity, new tasks go to the "To Do" column.
    const newTask = await fetch("/api/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        content: newTaskContent,
        description: newTaskDescription,
        columnId: "todo"
      })
    }).then((res) => res.json())

    setTasks([...tasks, newTask])
    setNewTaskContent("")
    setNewTaskDescription("")
  }

  // Render tasks grouped by column.
  const tasksByColumn = defaultColumns.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.columnId === col.id)
    return acc
  }, {} as Record<string, TaskType[]>)

  return (
    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
      <div className="flex gap-4 overflow-x-auto">
        {defaultColumns.map((column) => (
          <div key={column.id} className="bg-white dark:bg-slate-700 rounded p-2 min-w-[200px]">
            <h4 className="font-semibold text-sm mb-2">{column.title}</h4>
            {tasksByColumn[column.id]?.map((task) => (
              <div key={task._id} className="p-2 mb-2 bg-gray-100 dark:bg-gray-600 rounded text-xs">
                <div className="font-medium">{task.content}</div>
                {task.description && <p className="text-xs text-gray-500 dark:text-gray-300">{task.description}</p>}
              </div>
            ))}
            <div className="mt-2">
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
                className="mt-2 text-xs"
              />
              <Button onClick={addTask} size="sm" className="w-full mt-2">
                Add Task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
