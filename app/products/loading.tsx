import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import styles from './page.module.css';

/**
 * Loading UI for /products route
 * 
 * This component is shown during client-side navigation to /products
 * while the page is loading. Since the page uses ISR (server-rendered),
 * this primarily appears during client-side navigation transitions.
 */
export default function ProductsLoading() {
  return (
    <div>
      <h1 className={styles.title}>Product Catalog</h1>
      <LoadingSkeleton />
    </div>
  );
}

