import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type {
  AppData,
  Project,
  Todo,
  FilterState,
} from "../types";
import { loadData, saveData } from "../utils/storage";
import { generateId } from "../utils/id";
import { now } from "../utils/date";

interface AppContextValue {
  // Projects
  projects: Project[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  addProject: (name: string, description: string) => void;
  updateProject: (id: string, name: string, description: string) => void;
  deleteProject: (id: string) => void;

  // Todos
  todos: Todo[];
  addTodo: (
    todo: Pick<Todo, "title" | "description" | "priority" | "deadline" | "tags">
  ) => void;
  updateTodo: (id: string, updates: Partial<Omit<Todo, "id" | "projectId" | "createdAt">>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;

  // Filters
  filters: FilterState;
  setFilters: (filters: FilterState) => void;

  // Derived
  filteredTodos: Todo[];
  allTags: string[];

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_FILTERS: FilterState = {
  status: "all",
  priority: "all",
  tag: "",
  search: "",
  sortField: "createdAt",
  sortOrder: "desc",
};

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const persist = useCallback((next: AppData) => {
    setData(next);
    saveData(next);
  }, []);

  // --- Projects ---
  const addProject = useCallback(
    (name: string, description: string) => {
      const timestamp = now();
      const project: Project = {
        id: generateId(),
        name,
        description,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const next = { ...data, projects: [...data.projects, project] };
      persist(next);
      setActiveProjectId(project.id);
    },
    [data, persist]
  );

  const updateProject = useCallback(
    (id: string, name: string, description: string) => {
      const next = {
        ...data,
        projects: data.projects.map((p) =>
          p.id === id ? { ...p, name, description, updatedAt: now() } : p
        ),
      };
      persist(next);
    },
    [data, persist]
  );

  const deleteProject = useCallback(
    (id: string) => {
      const next = {
        projects: data.projects.filter((p) => p.id !== id),
        todos: data.todos.filter((t) => t.projectId !== id),
      };
      persist(next);
      if (activeProjectId === id) {
        setActiveProjectId(null);
      }
    },
    [data, persist, activeProjectId]
  );

  // --- Todos ---
  const addTodo = useCallback(
    (
      input: Pick<Todo, "title" | "description" | "priority" | "deadline" | "tags">
    ) => {
      if (!activeProjectId) return;
      const timestamp = now();
      const todo: Todo = {
        id: generateId(),
        projectId: activeProjectId,
        completed: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...input,
      };
      const next = { ...data, todos: [...data.todos, todo] };
      persist(next);
    },
    [data, persist, activeProjectId]
  );

  const updateTodo = useCallback(
    (id: string, updates: Partial<Omit<Todo, "id" | "projectId" | "createdAt">>) => {
      const next = {
        ...data,
        todos: data.todos.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: now() } : t
        ),
      };
      persist(next);
    },
    [data, persist]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      const next = { ...data, todos: data.todos.filter((t) => t.id !== id) };
      persist(next);
    },
    [data, persist]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      const next = {
        ...data,
        todos: data.todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed, updatedAt: now() } : t
        ),
      };
      persist(next);
    },
    [data, persist]
  );

  // --- Derived ---
  const projectTodos = useMemo(
    () =>
      activeProjectId
        ? data.todos.filter((t) => t.projectId === activeProjectId)
        : [],
    [data.todos, activeProjectId]
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    projectTodos.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [projectTodos]);

  const filteredTodos = useMemo(() => {
    let result = projectTodos;

    // Status filter
    if (filters.status === "active") {
      result = result.filter((t) => !t.completed);
    } else if (filters.status === "completed") {
      result = result.filter((t) => t.completed);
    }

    // Priority filter
    if (filters.priority !== "all") {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // Tag filter
    if (filters.tag) {
      result = result.filter((t) => t.tags.includes(filters.tag));
    }

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const field = filters.sortField;
      let cmp = 0;

      if (field === "priority") {
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      } else if (field === "deadline") {
        const ad = a.deadline ?? "9999-12-31";
        const bd = b.deadline ?? "9999-12-31";
        cmp = ad.localeCompare(bd);
      } else if (field === "title") {
        cmp = a.title.localeCompare(b.title);
      } else {
        cmp = a[field].localeCompare(b[field]);
      }

      return filters.sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [projectTodos, filters]);

  const value: AppContextValue = {
    projects: data.projects,
    activeProjectId,
    setActiveProjectId,
    addProject,
    updateProject,
    deleteProject,
    todos: data.todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    filters,
    setFilters,
    filteredTodos,
    allTags,
    sidebarOpen,
    setSidebarOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
