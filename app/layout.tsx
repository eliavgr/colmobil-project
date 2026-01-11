import type { Metadata } from "next";
import { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Colmobil Project",
  description: "E-commerce product catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <Link href="/" className={styles.logo}>
              Colmobil
            </Link>
            <div className={styles.navLinks}>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
              <Link href="/products" className={styles.navLink}>
                Products
              </Link>
            </div>
          </nav>
        </header>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
