import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { Priority, type FilterState, type StatusFilter, type TodoSortField, type SortOrder } from "../../types";
import styles from "./FilterBar.module.css";

export function FilterBar() {
  const { filters, setFilters, allTags } = useAppContext();
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters({ ...filters, search: searchInput });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters, setFilters]);

  const update = (partial: Partial<FilterState>) => {
    setFilters({ ...filters, ...partial });
  };

  return (
    <div className={styles.bar}>
      <div className={styles.searchRow}>
        <input
          className={styles.search}
          type="text"
          placeholder="検索..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className={styles.filters}>
        <select
          className={styles.select}
          value={filters.status}
          onChange={(e) => update({ status: e.target.value as StatusFilter })}
        >
          <option value="all">すべて</option>
          <option value="active">未完了</option>
          <option value="completed">完了</option>
        </select>

        <select
          className={styles.select}
          value={filters.priority}
          onChange={(e) =>
            update({ priority: e.target.value as Priority | "all" })
          }
        >
          <option value="all">優先度</option>
          <option value={Priority.High}>高</option>
          <option value={Priority.Medium}>中</option>
          <option value={Priority.Low}>低</option>
        </select>

        {allTags.length > 0 && (
          <select
            className={styles.select}
            value={filters.tag}
            onChange={(e) => update({ tag: e.target.value })}
          >
            <option value="">タグ</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        )}

        <select
          className={styles.select}
          value={filters.sortField}
          onChange={(e) =>
            update({ sortField: e.target.value as TodoSortField })
          }
        >
          <option value="createdAt">作成日</option>
          <option value="updatedAt">更新日</option>
          <option value="priority">優先度</option>
          <option value="deadline">期限</option>
          <option value="title">タイトル</option>
        </select>

        <button
          className={styles.sortBtn}
          onClick={() =>
            update({ sortOrder: (filters.sortOrder === "asc" ? "desc" : "asc") as SortOrder })
          }
          aria-label={filters.sortOrder === "asc" ? "降順に切替" : "昇順に切替"}
        >
          {filters.sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>
    </div>
  );
}
