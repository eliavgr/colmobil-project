import styles from './ErrorState.module.css';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>
        {message || 'An error occurred while loading the content. Please try again.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className={styles.button}>
          Try Again
        </button>
      )}
    </div>
  );
}
