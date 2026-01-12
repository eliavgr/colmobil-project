import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/ui/Header";
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
        <Header />
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
