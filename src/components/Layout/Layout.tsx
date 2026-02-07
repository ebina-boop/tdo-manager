import { useAppContext } from "../../context/AppContext";
import { Sidebar } from "../Sidebar/Sidebar";
import { TodoList } from "../TodoList/TodoList";
import styles from "./Layout.module.css";

export function Layout() {
  const { activeProjectId, sidebarOpen, setSidebarOpen } = useAppContext();

  return (
    <div className={styles.layout}>
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <Sidebar />
      </aside>
      <main className={styles.main}>
        <button
          className={styles.menuBtn}
          onClick={() => setSidebarOpen(true)}
          aria-label="メニューを開く"
        >
          ☰
        </button>
        {activeProjectId ? (
          <TodoList />
        ) : (
          <div className={styles.empty}>
            <p>プロジェクトを選択してください</p>
          </div>
        )}
      </main>
    </div>
  );
}
