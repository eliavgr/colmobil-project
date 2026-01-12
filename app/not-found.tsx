import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "./not-found.module.css";

/**
 * Metadata for 404 page
 */
export const metadata: Metadata = {
  title: "404 - Page Not Found | Colmobil",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <Image
          src="/media/icons/404-icon.svg"
          alt="404 Not Found"
          width={120}
          height={120}
          className={styles.icon}
        />
      </div>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Page Not Found</h2>
      <p className={styles.message}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div className={styles.buttons}>
        <Link href="/" className={`${styles.button} ${styles.buttonPrimary}`}>
          Go Home
        </Link>
        <Link
          href="/products"
          className={`${styles.button} ${styles.buttonSecondary}`}
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
