import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Modal } from "../common/Modal";
import type { Project } from "../../types";
import styles from "./ProjectForm.module.css";

interface ProjectFormProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectForm({ project, onClose }: ProjectFormProps) {
  const { addProject, updateProject } = useAppContext();
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [error, setError] = useState("");

  const isEdit = !!project;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("プロジェクト名を入力してください");
      return;
    }
    if (isEdit) {
      updateProject(project.id, trimmed, description.trim());
    } else {
      addProject(trimmed, description.trim());
    }
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isEdit ? "プロジェクトを編集" : "新規プロジェクト"}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="project-name">
            プロジェクト名 <span className={styles.required}>*</span>
          </label>
          <input
            id="project-name"
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="例: TDO Manager"
            autoFocus
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="project-desc">
            説明
          </label>
          <textarea
            id="project-desc"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="プロジェクトの概要"
            rows={3}
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
