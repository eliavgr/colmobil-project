'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './SearchFilterBar.module.css';

interface SearchFilterBarProps {
  categories: string[];
  onSearchChange: (searchQuery: string) => void;
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
}

/**
 * SearchFilterBar component with debounced search and category filter
 * - Search: debounced 300ms for client-side filtering
 * - Category: triggers API fetch on change
 * - Search works on currently loaded products (filtered by category)
 */
export default function SearchFilterBar({
  categories,
  onSearchChange,
  onCategoryChange,
  selectedCategory,
}: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Call onSearchChange when debounced search changes
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const category = e.target.value;
      onCategoryChange(category);
    },
    [onCategoryChange]
  );

  const clearFilters = () => {
    setSearchQuery('');
    onCategoryChange('');
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="search" className={styles.label}>
            Search
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title..."
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="category" className={styles.label}>
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className={styles.select}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className={styles.buttonContainer}>
          <button onClick={clearFilters} className={styles.clearButton}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
