import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Modal } from "../common/Modal";
import { Priority, type Todo } from "../../types";
import { formatDateForInput } from "../../utils/date";
import styles from "./TodoForm.module.css";

interface TodoFormProps {
  todo?: Todo;
  onClose: () => void;
}

export function TodoForm({ todo, onClose }: TodoFormProps) {
  const { addTodo, updateTodo } = useAppContext();
  const isEdit = !!todo;

  const [title, setTitle] = useState(todo?.title ?? "");
  const [description, setDescription] = useState(todo?.description ?? "");
  const [priority, setPriority] = useState<Priority>(todo?.priority ?? Priority.Medium);
  const [deadline, setDeadline] = useState(
    todo?.deadline ? formatDateForInput(todo.deadline) : ""
  );
  const [tagInput, setTagInput] = useState(todo?.tags.join(", ") ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("タイトルを入力してください");
      return;
    }

    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const deadlineVal = deadline ? new Date(deadline).toISOString() : null;

    if (isEdit) {
      updateTodo(todo.id, {
        title: trimmedTitle,
        description: description.trim(),
        priority,
        deadline: deadlineVal,
        tags,
      });
    } else {
      addTodo({
        title: trimmedTitle,
        description: description.trim(),
        priority,
        deadline: deadlineVal,
        tags,
      });
    }
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={isEdit ? "ToDoを編集" : "新規ToDo"}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="todo-title">
            タイトル <span className={styles.required}>*</span>
          </label>
          <input
            id="todo-title"
            className={styles.input}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
            placeholder="やること"
            autoFocus
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="todo-desc">
            説明
          </label>
          <textarea
            id="todo-desc"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="詳細な説明"
            rows={3}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="todo-priority">
              優先度
            </label>
            <select
              id="todo-priority"
              className={styles.select}
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value={Priority.High}>高</option>
              <option value={Priority.Medium}>中</option>
              <option value={Priority.Low}>低</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="todo-deadline">
              期限
            </label>
            <input
              id="todo-deadline"
              className={styles.input}
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="todo-tags">
            タグ（カンマ区切り）
          </label>
          <input
            id="todo-tags"
            className={styles.input}
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="例: bug, refactor, idea"
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            キャンセル
          </button>
          <button type="submit" className={styles.submitBtn}>
            {isEdit ? "更新" : "作成"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
