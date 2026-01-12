import styles from './page.module.css';

/**
 * Loading UI for /products/[id] route
 * 
 * This component is shown during client-side navigation to a product detail page
 * while the page is loading. Since the page uses SSG+ISR (server-rendered),
 * this primarily appears during client-side navigation transitions.
 */
export default function ProductDetailLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.productCard}>
        <div className={styles.grid}>
          {/* Image skeleton */}
          <div className={styles.imageContainer}>
            <div className={styles.imageSkeleton} />
          </div>

          {/* Details skeleton */}
          <div className={styles.details}>
            <div className={styles.titleSkeleton} />
            <div className={styles.priceSkeleton} />
            <div className={styles.categorySkeleton} />
            <div className={styles.descriptionSkeleton}>
              <div className={styles.descriptionLine} />
              <div className={styles.descriptionLine} />
              <div className={styles.descriptionLine} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
