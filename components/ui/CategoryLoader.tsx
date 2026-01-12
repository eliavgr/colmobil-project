import styles from './CategoryLoader.module.css';

/**
 * Small loader component for category fetch updates
 * Shows a subtle loading indicator while category products are being fetched
 */
export default function CategoryLoader() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <span className={styles.text}>Loading products...</span>
    </div>
  );
}

