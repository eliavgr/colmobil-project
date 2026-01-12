"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import SearchFilterBar from "@/components/product/SearchFilterBar";
import CategoryLoader from "@/components/ui/CategoryLoader";
import ErrorState from "@/components/ui/ErrorState";
import { getProductsByCategory, FakeStoreAPIError } from "@/lib/fakestore";
import styles from "./page.module.css";

interface ProductsClientProps {
  initialProducts: Product[];
  categories: string[];
}

/**
 * Client component for interactive product filtering
 * - Initial products are rendered from server (SEO-friendly)
 * - Category filter: fetches from API endpoint (getProductsByCategory)
 * - Search: client-side filtering on currently loaded products (fast UX)
 * - Search is debounced 300ms for better performance
 * - Shows user-friendly error messages with retry functionality
 */
export default function ProductsClient({
  initialProducts,
  categories,
}: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products by category when category changes
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!selectedCategory) {
        // Reset to initial products when "All Categories" is selected
        setProducts(initialProducts);
        setError(null);
        return;
      }

      setIsLoadingCategory(true);
      setError(null);

      try {
        const categoryProducts = await getProductsByCategory(selectedCategory);
        setProducts(categoryProducts);
      } catch (err) {
        // Provide user-friendly error messages
        let errorMessage =
          "Unable to load products for this category. Please try again.";

        if (err instanceof FakeStoreAPIError) {
          if (err.statusCode === 404) {
            errorMessage = `Category "${selectedCategory}" not found. Please select a different category.`;
          } else if (err.statusCode) {
            errorMessage =
              "Unable to load products at this time. Please try again later.";
          } else {
            errorMessage =
              "Network error. Please check your connection and try again.";
          }
        } else if (err instanceof Error) {
          errorMessage =
            "An error occurred while loading products. Please try again.";
        }

        setError(errorMessage);
        // Keep current products instead of resetting on error
      } finally {
        setIsLoadingCategory(false);
      }
    };

    fetchCategoryProducts();
  }, [selectedCategory, initialProducts]);

  // Client-side search filtering on currently loaded products
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase();
    return products.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setError(null);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleRetry = useCallback(() => {
    // Retry fetching category products
    if (selectedCategory) {
      setError(null);
      // Trigger refetch by updating the state
      const currentCategory = selectedCategory;
      setSelectedCategory("");
      setTimeout(() => {
        setSelectedCategory(currentCategory);
      }, 0);
    } else {
      // Reload page for initial products error (shouldn't happen, but just in case)
      window.location.reload();
    }
  }, [selectedCategory]);

  return (
    <div>
      <h1 className={styles.title}>Products Catalog</h1>
      <SearchFilterBar
        categories={categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />

      {/* Show error state with retry button */}
      {error && !isLoadingCategory && (
        <ErrorState message={error} onRetry={handleRetry} />
      )}

      {/* Show loading indicator for category updates */}
      {isLoadingCategory && !error && <CategoryLoader />}

      {/* Show products list when not loading and no error */}
      {!isLoadingCategory && !error && (
        <>
          {filteredProducts.length > 0 ? (
            <>
              <p className={styles.count}>
                Showing {filteredProducts.length} of {products.length} products
                {selectedCategory && ` in category "${selectedCategory}"`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
              <div className={styles.grid}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>
                {searchQuery
                  ? `No products found matching "${searchQuery}".`
                  : "No products found."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
