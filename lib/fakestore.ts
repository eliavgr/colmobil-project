import { Product, ProductFilters } from './types';

const API_BASE_URL = 'https://fakestoreapi.com';

/**
 * Error class for FakeStore API errors
 */
export class FakeStoreAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'FakeStoreAPIError';
  }
}

/**
 * Fetches all products from FakeStore API
 * @returns Promise resolving to an array of products
 * @throws {FakeStoreAPIError} If the API request fails
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      next: { revalidate: 3600 }, // Revalidate every hour for ISR
    });

    if (!response.ok) {
      throw new FakeStoreAPIError(
        `Failed to fetch products: ${response.status} ${response.statusText}`,
        response.status,
        '/products'
      );
    }

    const products = await response.json();
    return products;
  } catch (error) {
    if (error instanceof FakeStoreAPIError) {
      throw error;
    }
    throw new FakeStoreAPIError(
      `Network error while fetching products: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      '/products'
    );
  }
}

/**
 * Fetches a single product by ID from FakeStore API
 * @param id - The product ID
 * @returns Promise resolving to a product
 * @throws {FakeStoreAPIError} If the API request fails or product is not found
 */
export async function getProduct(id: number): Promise<Product> {
  if (!id || id <= 0) {
    throw new FakeStoreAPIError(
      `Invalid product ID: ${id}. ID must be a positive number.`,
      undefined,
      `/products/${id}`
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour for ISR
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new FakeStoreAPIError(
          `Product with ID ${id} not found`,
          response.status,
          `/products/${id}`
        );
      }
      throw new FakeStoreAPIError(
        `Failed to fetch product ${id}: ${response.status} ${response.statusText}`,
        response.status,
        `/products/${id}`
      );
    }

    const product = await response.json();
    return product;
  } catch (error) {
    if (error instanceof FakeStoreAPIError) {
      throw error;
    }
    throw new FakeStoreAPIError(
      `Network error while fetching product ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      `/products/${id}`
    );
  }
}

/**
 * Fetches all product categories from FakeStore API
 * @returns Promise resolving to an array of category names
 * @throws {FakeStoreAPIError} If the API request fails
 */
export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`, {
      next: { revalidate: 3600 }, // Revalidate every hour for ISR
    });

    if (!response.ok) {
      throw new FakeStoreAPIError(
        `Failed to fetch categories: ${response.status} ${response.statusText}`,
        response.status,
        '/products/categories'
      );
    }

    const categories = await response.json();
    return categories;
  } catch (error) {
    if (error instanceof FakeStoreAPIError) {
      throw error;
    }
    throw new FakeStoreAPIError(
      `Network error while fetching categories: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      '/products/categories'
    );
  }
}

/**
 * Fetches all products in a specific category from FakeStore API
 * @param category - The category name
 * @returns Promise resolving to an array of products in the category
 * @throws {FakeStoreAPIError} If the API request fails or category is invalid
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (!category || category.trim().length === 0) {
    throw new FakeStoreAPIError(
      'Category name cannot be empty',
      undefined,
      `/products/category/${category}`
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}`, {
      next: { revalidate: 3600 }, // Revalidate every hour for ISR
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new FakeStoreAPIError(
          `Category "${category}" not found`,
          response.status,
          `/products/category/${category}`
        );
      }
      throw new FakeStoreAPIError(
        `Failed to fetch products for category "${category}": ${response.status} ${response.statusText}`,
        response.status,
        `/products/category/${category}`
      );
    }

    const products = await response.json();
    return products;
  } catch (error) {
    if (error instanceof FakeStoreAPIError) {
      throw error;
    }
    throw new FakeStoreAPIError(
      `Network error while fetching products for category "${category}": ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      `/products/category/${category}`
    );
  }
}

/**
 * Filters products based on the provided filters
 * Client-side filtering utility function
 * @param products - Array of products to filter
 * @param filters - Filter criteria
 * @returns Filtered array of products
 */
export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  return products.filter((product) => {
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Price filters
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    return true;
  });
}
