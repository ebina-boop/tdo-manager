export enum Priority {
  High = "high",
  Medium = "medium",
  Low = "low",
}

export interface Todo {
  id: string;
  projectId: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  deadline: string | null;
  tags: string[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  projects: Project[];
  todos: Todo[];
}

export type TodoSortField = "position" | "createdAt" | "updatedAt" | "priority" | "deadline" | "title";
export type SortOrder = "asc" | "desc";
export type StatusFilter = "all" | "active" | "completed";

export interface FilterState {
  status: StatusFilter;
  priority: Priority | "all";
  tag: string;
  search: string;
  sortField: TodoSortField;
  sortOrder: SortOrder;
}
