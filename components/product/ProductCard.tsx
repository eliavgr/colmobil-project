import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard component - Simple and clean
 * Displays: image, title, and price
 */
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.price}>${product.price.toFixed(2)}</div>
      </div>
    </Link>
  );
}
