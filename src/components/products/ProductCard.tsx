import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string | null;
  isOnSale?: boolean;
  isFeatured?: boolean;
}

export const ProductCard = ({
  slug,
  name,
  price,
  originalPrice,
  imageUrl,
  isOnSale,
}: ProductCardProps) => {
  return (
    <Link
      to={`/product/${slug}`}
      className="group block bg-card pixel-border retro-shadow hover-lift overflow-hidden animate-pixel-fade-in"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <span className="font-pixel text-secondary-foreground text-xs">
              NO IMG
            </span>
          </div>
        )}

        {/* Sale Badge */}
        {isOnSale && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground font-pixel text-xs px-2 py-1">
            SALE
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 bg-card">
        <h3 className="font-retro text-xl text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-pixel text-sm text-primary">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="font-retro text-lg text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
