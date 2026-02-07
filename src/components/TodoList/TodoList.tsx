import { useState, useRef } from "react";
import { useAppContext } from "../../context/AppContext";
import { FilterBar } from "../FilterBar/FilterBar";
import { TodoItem } from "../TodoItem/TodoItem";
import { TodoForm } from "../TodoForm/TodoForm";
import styles from "./TodoList.module.css";

export function TodoList() {
  const { filteredTodos, projects, activeProjectId, reorderTodos, filters, setFilters } =
    useAppContext();
  const [showForm, setShowForm] = useState(false);
  const dragItemId = useRef<string | null>(null);
  const dragOverId = useRef<string | null>(null);

  const project = projects.find((p) => p.id === activeProjectId);

  const handleDragStart = (id: string) => {
    dragItemId.current = id;
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    dragOverId.current = id;
  };

  const handleDrop = () => {
    if (dragItemId.current && dragOverId.current && dragItemId.current !== dragOverId.current) {
      // ドラッグしたら手動ソートに切り替え
      if (filters.sortField !== "position") {
        setFilters({ ...filters, sortField: "position", sortOrder: "asc" });
      }
      reorderTodos(dragItemId.current, dragOverId.current);
    }
    dragItemId.current = null;
    dragOverId.current = null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.projectName}>{project?.name}</h2>
          {project?.description && (
            <p className={styles.projectDesc}>{project.description}</p>
          )}
        </div>
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          + ToDo追加
        </button>
      </div>

      <FilterBar />

      <div className={styles.list}>
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDragStart={() => handleDragStart(todo.id)}
            onDragOver={(e) => handleDragOver(e, todo.id)}
            onDrop={handleDrop}
          />
        ))}
        {filteredTodos.length === 0 && (
          <p className={styles.empty}>ToDoがありません</p>
        )}
      </div>

      {showForm && <TodoForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
