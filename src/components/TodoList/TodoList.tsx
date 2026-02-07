import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { FilterBar } from "../FilterBar/FilterBar";
import { TodoItem } from "../TodoItem/TodoItem";
import { TodoForm } from "../TodoForm/TodoForm";
import styles from "./TodoList.module.css";

export function TodoList() {
  const { filteredTodos, projects, activeProjectId } = useAppContext();
  const [showForm, setShowForm] = useState(false);

  const project = projects.find((p) => p.id === activeProjectId);

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
          <TodoItem key={todo.id} todo={todo} />
        ))}
        {filteredTodos.length === 0 && (
          <p className={styles.empty}>ToDoがありません</p>
        )}
      </div>

      {showForm && <TodoForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
