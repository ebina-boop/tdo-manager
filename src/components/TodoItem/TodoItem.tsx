import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Badge } from "../common/Badge";
import { TodoDetail } from "../TodoDetail/TodoDetail";
import { formatDate, isOverdue } from "../../utils/date";
import type { Todo } from "../../types";
import styles from "./TodoItem.module.css";

interface TodoItemProps {
  todo: Todo;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
}

export function TodoItem({ todo, onDragStart, onDragOver, onDrop }: TodoItemProps) {
  const { toggleTodo } = useAppContext();
  const [showDetail, setShowDetail] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const overdue = !todo.completed && isOverdue(todo.deadline);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("label")) return;
    setShowDetail(true);
  };

  const itemClass = [
    styles.item,
    todo.completed ? styles.completed : "",
    isDragging ? styles.dragging : "",
    isDragOver ? styles.dragOver : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        className={itemClass}
        onClick={handleCardClick}
        draggable
        onDragStart={(e) => {
          setIsDragging(true);
          e.dataTransfer.effectAllowed = "move";
          onDragStart?.();
        }}
        onDragEnd={() => setIsDragging(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
          onDragOver?.(e);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          onDrop?.();
        }}
      >
        <div className={styles.topRow}>
          <label
            className={styles.checkLabel}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className={styles.checkbox}
            />
          </label>
          <div className={styles.content}>
            <span className={styles.title}>{todo.title}</span>
            <Badge label={todo.priority} variant={todo.priority} />
          </div>
        </div>
        {todo.description && (
          <p className={styles.description}>{todo.description}</p>
        )}
        {(todo.deadline || todo.tags.length > 0) && (
          <div className={styles.meta}>
            {todo.deadline && (
              <span className={`${styles.deadline} ${overdue ? styles.overdue : ""}`}>
                {overdue ? "⚠ " : ""}期限: {formatDate(todo.deadline)}
              </span>
            )}
            {todo.tags.map((tag) => (
              <Badge key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>

      {showDetail && (
        <TodoDetail todo={todo} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}
