import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { ProjectForm } from "../ProjectForm/ProjectForm";
import { ConfirmDialog } from "../common/ConfirmDialog";
import type { Project } from "../../types";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const {
    projects,
    activeProjectId,
    setActiveProjectId,
    deleteProject,
    todos,
    setSidebarOpen,
  } = useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const handleSelect = (id: string) => {
    setActiveProjectId(id);
    setSidebarOpen(false);
  };

  const todoCountFor = (projectId: string) =>
    todos.filter((t) => t.projectId === projectId && !t.completed).length;

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.logo}>TDO Manager</h1>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.addBtn}
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
        >
          + 新規プロジェクト
        </button>
      </div>
      <nav className={styles.list}>
        {projects.map((p) => (
          <div
            key={p.id}
            className={`${styles.item} ${activeProjectId === p.id ? styles.active : ""}`}
            onClick={() => handleSelect(p.id)}
          >
            <div className={styles.itemContent}>
              <span className={styles.itemName}>{p.name}</span>
              {todoCountFor(p.id) > 0 && (
                <span className={styles.count}>{todoCountFor(p.id)}</span>
              )}
            </div>
            <div className={styles.itemActions}>
              <button
                className={styles.iconBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingProject(p);
                  setShowForm(true);
                }}
                aria-label="編集"
              >
                ✎
              </button>
              <button
                className={styles.iconBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingProject(p);
                }}
                aria-label="削除"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className={styles.emptyMsg}>プロジェクトがありません</p>
        )}
      </nav>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={() => setShowForm(false)}
        />
      )}

      <ConfirmDialog
        open={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={() => {
          if (deletingProject) deleteProject(deletingProject.id);
        }}
        title="プロジェクトの削除"
        message={`「${deletingProject?.name}」とそのすべてのToDoを削除しますか？`}
      />
    </div>
  );
}
