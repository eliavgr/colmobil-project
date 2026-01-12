import styles from './LoadingSkeleton.module.css';

export default function LoadingSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.image} />
          <div className={styles.content}>
            <div className={`${styles.line} ${styles.lineFull}`} />
            <div className={`${styles.line} ${styles.lineShort}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
