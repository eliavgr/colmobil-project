import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, getAllProducts, FakeStoreAPIError } from '@/lib/fakestore';
import styles from './page.module.css';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Helper function to truncate description for metadata
 * Truncates to ~155 characters (optimal for SEO meta descriptions)
 */
function truncateDescription(description: string, maxLength: number = 155): string {
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength).trim() + '...';
}

/**
 * Generate metadata for each product page dynamically
 * 
 * This enables SEO-friendly meta tags for each product:
 * - Title includes product title
 * - Description is truncated from product description (optimal length for SEO)
 * - Open Graph tags for social media sharing
 * 
 * Uses getProduct API client to fetch product data for metadata generation.
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId) || productId <= 0) {
    return {
      title: 'Product Not Found | Colmobil',
      description: 'The requested product could not be found.',
    };
  }

  try {
    const product = await getProduct(productId);
    const truncatedDescription = truncateDescription(product.description);
    
    return {
      title: `${product.title} | Colmobil`,
      description: truncatedDescription,
      openGraph: {
        title: product.title,
        description: truncatedDescription,
        images: [product.image],
        type: 'website',
      },
    };
  } catch (error) {
    // If product not found or any error, return default metadata
    return {
      title: 'Product Not Found | Colmobil',
      description: 'The requested product could not be found.',
    };
  }
}

/**
 * Generate static params for all products at build time
 * 
 * This pre-generates pages for all known products during build time,
 * which enables fast initial page loads via static generation.
 * Uses getAllProducts API client to fetch all products.
 */
export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return products.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    // If fetch fails during build, return empty array
    // Pages will be generated on-demand
    return [];
  }
}

/**
 * Product Detail Page - Rendering Strategy: SSG + ISR
 * 
 * This page uses Static Site Generation (SSG) with Incremental Static Regeneration (ISR):
 * 
 * **Static Generation (SSG):**
 * - Pages are pre-generated at build time via generateStaticParams()
 * - All known products are statically generated during build
 * - Provides instant page loads (served from CDN)
 * - Fully rendered HTML available for search engines (optimal SEO)
 * 
 * **Incremental Static Regeneration (ISR):**
 * - Content is revalidated every hour (3600 seconds) via revalidate export
 * - Ensures product data stays fresh without rebuilding entire site
 * - Stale-while-revalidate: users get cached content while revalidation happens in background
 * - New products can be generated on-demand or during next revalidation
 * 
 * **Error Handling:**
 * - Invalid IDs (< 0 or NaN) call notFound() immediately
 * - API 404 errors (product not found) call notFound() to show 404 page
 * - Uses getProduct API client which throws FakeStoreAPIError with status 404
 * - All other errors also trigger notFound() for consistent UX
 * 
 * **Why SSG+ISR over SSR?**
 * - Better performance: Pages served from CDN edge locations (lower latency)
 * - Better SEO: Fully pre-rendered HTML available immediately
 * - Lower server load: No server computation needed on each request
 * - Fresh content: ISR ensures data stays current without sacrificing performance
 * - Scalability: Works perfectly with CDN caching and edge networks
 * 
 * **Trade-offs:**
 * - Content updates have up to 1 hour delay (revalidate period)
 * - Initial build time includes all products (acceptable for small-medium catalogs)
 * - New products require revalidation or on-demand generation
 */
export const revalidate = 3600; // Revalidate every hour

/**
 * Product detail page component
 * 
 * Fetches product data using getProduct API client and displays:
 * - Product image (large, optimized with next/image)
 * - Product title
 * - Full product description
 * - Price
 * - Category
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  // Validate ID - call notFound() for invalid IDs
  if (isNaN(productId) || productId <= 0) {
    notFound();
  }

  try {
    // Fetch product data using API client
    // This uses ISR caching - data is cached and revalidated per revalidate setting
    const product = await getProduct(productId);

    return (
      <div className={styles.container}>
        <Link href="/products" className={styles.backLink}>
          ← Back to Products
        </Link>

        <div className={styles.productCard}>
          <div className={styles.grid}>
            {/* Product Image - Large display */}
            <div className={styles.imageContainer}>
              <Image
                src={product.image}
                alt={product.title}
                fill
                className={styles.image}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Product Details */}
            <div className={styles.details}>
              <h1 className={styles.productTitle}>{product.title}</h1>

              <div className={styles.price}>${product.price.toFixed(2)}</div>

              <div className={styles.category}>{product.category}</div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Description</h2>
                <p className={styles.description}>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Handle API errors - call notFound() for 404 or any error
    // getProduct throws FakeStoreAPIError with status 404 for not found products
    if (error instanceof FakeStoreAPIError && error.statusCode === 404) {
      notFound();
    }
    
    // For any other error, also call notFound() for consistent UX
    notFound();
  }
}
