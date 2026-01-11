# Colmobil Project

A Next.js 14+ e-commerce product catalog built with TypeScript, App Router, and CSS Modules.

## Overview

This project is a product catalog application that displays products from the FakeStore API. It features a clean, responsive UI with server-side rendering optimizations for SEO and performance.

**Key Features:**

- Product catalog with search and category filtering
- Product detail pages
- Server-side rendering with ISR (Incremental Static Regeneration)
- Responsive design (mobile-first)
- TypeScript for type safety
- CSS Modules for styling

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Rendering Strategy

This project uses a hybrid rendering approach optimized for both SEO and performance.

### `/products` - ISR (Incremental Static Regeneration)

**Strategy:** Static Generation + ISR with 1-hour revalidation

**Why ISR:**

- **SEO Optimization:** Pages are pre-rendered as static HTML at build time, making all product listings immediately available to search engines
- **Fast Initial Load:** Static HTML is served from CDN edge locations, eliminating server computation on each request
- **Fresh Content:** ISR revalidates content every hour, ensuring product data stays current without sacrificing performance
- **Scalability:** Works seamlessly with CDN caching, reducing server load

**Implementation:**

- Server component fetches all products and categories at build time
- Content is revalidated every 3600 seconds (1 hour)
- Initial HTML includes all products for optimal SEO
- Client component handles interactive filtering without affecting initial render

### `/products/[id]` - SSG + ISR

**Strategy:** Static Site Generation with ISR

**Why SSG + ISR:**

- **Build-time Generation:** All product pages are pre-generated via `generateStaticParams()` for instant page loads
- **SEO Benefits:** Fully rendered HTML with dynamic metadata (`generateMetadata`) for each product
- **Performance:** Pages served from CDN with zero server computation
- **Data Freshness:** ISR revalidates product data every hour, ensuring prices and availability stay current
- **Better than SSR:** Eliminates server-side processing on each request, resulting in lower latency and better scalability

**Trade-offs Considered:**

- SSR would require server computation on each request (higher latency)
- Pure SSG without ISR would require full rebuilds for data updates
- SSG + ISR provides the best balance: instant loads + fresh data + optimal SEO

### Search and Filter Implementation

**Hybrid Approach:**

1. **Initial Load (SSR/SSG):**

   - All products are fetched server-side and included in initial HTML
   - Ensures search engines can index all product data
   - Provides instant content for users (no loading spinner on first visit)

2. **Category Filtering (Dynamic API Fetch):**

   - When a category is selected, the app fetches products from the API endpoint (`/products/category/{category}`)
   - Provides accurate, server-filtered results for each category
   - Shows loading indicator during fetch (better UX than client-side filtering across all products)

3. **Search (Client-side):**
   - Search queries filter the currently loaded products client-side
   - Debounced 300ms for performance
   - Instant feedback without API calls
   - Fast UX since it operates on already-loaded data

**Why This Approach:**

- **SEO:** Initial server-rendered content ensures all products are indexable
- **Performance:** Client-side search is instant (no network delay)
- **Accuracy:** Category filtering uses API to get exact category matches
- **User Experience:** Fast search + accurate category filtering + no loading state on initial page load

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   ├── not-found.tsx           # 404 page
│   └── products/
│       ├── page.tsx            # Product catalog (ISR)
│       ├── loading.tsx         # Route-level loading UI
│       ├── ProductsClient.tsx  # Client component for filtering
│       └── [id]/
│           ├── page.tsx        # Product details (SSG+ISR)
│           └── loading.tsx     # Route-level loading UI
├── components/
│   ├── product/                # Product-related components
│   │   ├── ProductCard.tsx     # Product card component
│   │   └── SearchFilterBar.tsx # Search and filter controls
│   └── ui/                     # Reusable UI components
│       ├── ErrorState.tsx      # Error state component
│       ├── LoadingSkeleton.tsx # Loading state component
│       └── CategoryLoader.tsx  # Small loader for category updates
└── lib/
    ├── types.ts                # TypeScript type definitions
    └── fakestore.ts            # FakeStore API client
```

## API

This project uses the [FakeStore API](https://fakestoreapi.com/) for product data.

API Endpoints:

- `GET /products` - All products
- `GET /products/{id}` - Single product
- `GET /products/categories` - All categories
- `GET /products/category/{category}` - Products by category

## Technologies

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **CSS Modules** - Component-scoped styling
- **React** - UI library
