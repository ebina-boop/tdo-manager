import { useEffect, useRef, useCallback, type ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "default" | "wide";
  headerActions?: ReactNode;
}

export function Modal({ open, onClose, title, children, size = "default", headerActions }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handleClose = () => onClose();
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  if (!open) return null;

  const className = `${styles.modal} ${size === "wide" ? styles.wide : ""}`;

  return (
    <dialog ref={dialogRef} className={className} onClick={handleBackdropClick}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.headerRight}>
            {headerActions}
            <button className={styles.closeBtn} onClick={onClose} aria-label="閉じる">
              &times;
            </button>
          </div>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </dialog>
  );
}
