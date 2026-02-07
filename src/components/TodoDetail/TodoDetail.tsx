import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Modal } from "../common/Modal";
import { Badge } from "../common/Badge";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { TodoForm } from "../TodoForm/TodoForm";
import { formatDate, isOverdue } from "../../utils/date";
import type { Todo } from "../../types";
import styles from "./TodoDetail.module.css";

interface TodoDetailProps {
  todo: Todo;
  onClose: () => void;
}

export function TodoDetail({ todo, onClose }: TodoDetailProps) {
  const { toggleTodo, deleteTodo } = useAppContext();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const overdue = !todo.completed && isOverdue(todo.deadline);

  return (
    <>
      <Modal
        open
        onClose={onClose}
        title="ToDo詳細"
        size="wide"
        headerActions={
          <div className={styles.headerActions}>
            <button
              className={styles.headerEditBtn}
              onClick={() => setShowEdit(true)}
            >
              編集
            </button>
            <button
              className={styles.headerDeleteBtn}
              onClick={() => setShowDelete(true)}
            >
              削除
            </button>
          </div>
        }
      >
        <div className={styles.detail}>
          <div className={styles.titleRow}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className={styles.checkbox}
              />
            </label>
            <h3 className={`${styles.title} ${todo.completed ? styles.completedTitle : ""}`}>
              {todo.title}
            </h3>
          </div>

          <div className={styles.badges}>
            <Badge label={todo.priority} variant={todo.priority} />
            {todo.tags.map((tag) => (
              <Badge key={tag} label={tag} />
            ))}
          </div>

          {todo.deadline && (
            <div className={`${styles.deadlineRow} ${overdue ? styles.overdue : ""}`}>
              {overdue ? "⚠ " : ""}期限: {formatDate(todo.deadline)}
            </div>
          )}

          {todo.description ? (
            <div className={styles.descriptionSection}>
              <h4 className={styles.sectionLabel}>説明</h4>
              <p className={styles.description}>{todo.description}</p>
            </div>
          ) : (
            <p className={styles.noDescription}>説明なし</p>
          )}

          <div className={styles.timestamps}>
            <span>作成: {formatDate(todo.createdAt)}</span>
            <span>更新: {formatDate(todo.updatedAt)}</span>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.editBtn}
              onClick={() => setShowEdit(true)}
            >
              編集
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => setShowDelete(true)}
            >
              削除
            </button>
          </div>
        </div>
      </Modal>

      {showEdit && (
        <TodoForm
          todo={todo}
          onClose={() => {
            setShowEdit(false);
            onClose();
          }}
        />
      )}

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => {
          deleteTodo(todo.id);
          onClose();
        }}
        title="ToDoの削除"
        message={`「${todo.title}」を削除しますか？`}
      />
    </>
  );
}
