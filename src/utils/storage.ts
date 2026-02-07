import type { AppData } from "../types";

const STORAGE_KEY = "tdo-manager-data";

const DEFAULT_DATA: AppData = {
  projects: [],
  todos: [],
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const data = JSON.parse(raw) as AppData;
    // 既存データに position がない場合のマイグレーション
    data.todos = data.todos.map((t, i) => ({
      ...t,
      position: t.position ?? i,
    }));
    return data;
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
