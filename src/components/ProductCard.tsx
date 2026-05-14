// ProductCard component - used in product listings
import { Link } from "react-router-dom";
import { Tag, ArrowRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  return (
    <div className="product-card flex flex-col h-full">
      {/* Category color bar */}
      <div className="h-2 bg-brand-yellow w-full" />

      <div className="p-5 flex flex-col flex-1">
        {/* Category badge */}
        <span className="category-badge mb-3 self-start">
          <Tag size={10} className="inline mr-1" />
          {product.category}
        </span>

        {/* Product name */}
        <h3 className="font-bold text-foreground text-base leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
          {product.description}
        </p>

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <span className="price-tag">{formatPrice(product.price)}</span>
          <Link
            to={`/products/${product.id}`}
            className="btn-brand inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold"
          >
            Ver Detalhes
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
