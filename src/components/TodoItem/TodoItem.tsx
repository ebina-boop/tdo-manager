import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Badge } from "../common/Badge";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { TodoForm } from "../TodoForm/TodoForm";
import { formatDate, isOverdue } from "../../utils/date";
import type { Todo } from "../../types";
import styles from "./TodoItem.module.css";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useAppContext();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const overdue = !todo.completed && isOverdue(todo.deadline);

  return (
    <>
      <div className={`${styles.item} ${todo.completed ? styles.completed : ""}`}>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => setShowEdit(true)}
            aria-label="編集"
          >
            ✎
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => setShowDelete(true)}
            aria-label="削除"
          >
            🗑
          </button>
        </div>
        <div className={styles.topRow}>
          <label className={styles.checkLabel}>
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

      {showEdit && (
        <TodoForm todo={todo} onClose={() => setShowEdit(false)} />
      )}

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteTodo(todo.id)}
        title="ToDoの削除"
        message={`「${todo.title}」を削除しますか？`}
      />
    </>
  );
}
