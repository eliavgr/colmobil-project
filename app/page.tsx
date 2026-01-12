import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

/**
 * Metadata for SEO
 */
export const metadata: Metadata = {
  title: "Home | Colmobil",
  description:
    "Welcome to Colmobil - Your trusted source for quality products.",
};

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>HELLO WORLD</h1>
      <p className={styles.subtitle}>Welcome to our products catalog</p>
      <Link href="/products" className={styles.button}>
        Browse Products
      </Link>
    </div>
  );
}
