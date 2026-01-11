import type { Metadata } from "next";
import { getAllProducts, getCategories } from "@/lib/fakestore";
import ProductsClient from "./ProductsClient";

/**
 * Metadata for SEO - statically generated and cached
 */
export const metadata: Metadata = {
  title: "Product Catalog | Colmobil",
  description:
    "Browse our complete product catalog. Find the perfect products with advanced search and filtering options.",
};

/**
 * This page uses ISR (Incremental Static Regeneration) with revalidate
 *
 * Rendering Strategy: Static Generation + ISR
 * - Page is statically generated at build time for fast initial load
 * - Content is revalidated every hour (3600 seconds) to ensure freshness
 * - Provides optimal SEO (fully rendered HTML for search engines)
 * - Excellent performance (served from CDN, no server computation on request)
 * - Data fetching happens at build time and during revalidation
 * - Client-side filtering is handled by ProductsClient component for interactivity
 */
export const revalidate = 3600; // Revalidate every hour

export default async function ProductsPage() {
  // Fetch data on the server with ISR caching
  // This data will be cached and reused until revalidation
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  // Pass pre-fetched data to client component for interactive filtering
  return <ProductsClient initialProducts={products} categories={categories} />;
}
