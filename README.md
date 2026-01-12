# Colmobil Project

A product catalog project built with Next.js 14, TypeScript, and CSS Modules. The project displays products from the FakeStore API with a clean and responsive user interface.

## Installation and Setup

### Prerequisites

- Node.js 18 or higher
- npm (or yarn/pnpm)

### Setup Steps

1. Clone the repository:

```bash
git clone https://github.com/eliavgr/colmobil-project.git
cd colmobil-project
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser at http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## Rendering Strategies

The project uses a hybrid approach that combines Server Components and Client Components to achieve optimal performance and SEO.

### Home Page (`/`)

**Strategy:** Static Site Generation (SSG)

A simple static page that doesn't require dynamic data. Built at build time and served from CDN. No ISR needed since the content doesn't change.

### Products Catalog Page (`/products`)

**Strategy:** ISR (Incremental Static Regeneration)

The page is built as static at build time with all products, and revalidated every hour (`revalidate: 3600`).

**Why ISR?**

- All products are included in the initial HTML - great for SEO
- Fast loading - the page is ready immediately from CDN
- Fresh content - ISR revalidates every hour
- Great performance - no server processing on each request
- Better scalability - SSR was avoided because the catalog data is public and relatively static. Regenerating it periodically via ISR provides better scalability and faster response times compared to server rendering on every request

**How it works:**

- Server Component (`page.tsx`) fetches all products and categories at build time
- Data is cached for one hour
- Client Component (`ProductsClient`) handles filtering and search on the client side
- When changing category, there's a dynamic fetch from the API

### Product Detail Page (`/products/[id]`)

**Strategy:** SSG + ISR

Each product page is pre-built at build time via `generateStaticParams()`, and revalidated every hour.

**Why SSG + ISR?**

- All product pages are ready in advance - instant loading
- Excellent SEO - full HTML with dynamic metadata for each product
- Great performance - served from CDN without server processing
- Fresh content - ISR revalidates every hour
- More efficient - SSR was not chosen because product pages do not require per-request personalization, making SSG + ISR a more efficient and scalable solution

**How it works:**

- `generateStaticParams()` creates a list of all IDs at build time
- Each page is pre-built with full data
- `generateMetadata()` creates unique metadata for each product (title, description, image)
- If a product doesn't exist, `notFound()` is called to show a 404 page

## Search and Filtering

The project uses a hybrid approach for search and filtering:

**Search:**

- Performed on the client side on already loaded products
- 300ms debounce to prevent unnecessary searches
- Instant response without API calls

**Category Filtering:**

- When changing category, there's a dynamic fetch from the API
- This ensures accurate results by category
- A small loader is shown during loading

**Why this approach?**

- Search is fast because it's on already loaded data
- Filtering is accurate because it's from the server
- The initial HTML includes all products - great for SEO

## Loading, Error and 404 Handling

The project implements comprehensive error and loading state management:

- **Loading States:** Route-level loading states are implemented using `loading.tsx` files (`/products/loading.tsx` and `/products/[id]/loading.tsx`) to provide immediate user feedback during client-side navigation and data fetching
- **Error Handling:** API failures are handled gracefully with user-friendly error messages and retry functionality via the `ErrorState` component
- **404 Handling:** Invalid product IDs or unknown routes are handled using Next.js `notFound()` function, which displays a custom 404 page (`app/not-found.tsx`)

## SEO Considerations

The project is optimized for search engine visibility:

- **Server-rendered Content:** All catalog and product pages are server-rendered (SSG/ISR), ensuring full HTML content is available to search engines without requiring JavaScript execution
- **Dynamic Metadata:** Dynamic metadata is generated per product (title, description, Open Graph image) using the Next.js Metadata API, improving social media sharing and search result appearance
- **Crawlability:** Client-side interactivity (search/filter) does not affect crawlability - the initial HTML includes all products, making them fully indexable by search engines
