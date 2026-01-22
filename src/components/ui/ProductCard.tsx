import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="card-elevated overflow-hidden group animate-fade-in">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors">
          <Heart className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {product.isVegan && (
            <Badge variant="secondary" className="bg-primary/90 text-primary-foreground text-xs">
              VEGAN
            </Badge>
          )}
          {product.isVegetarian && !product.isVegan && (
            <Badge variant="secondary" className="bg-primary/90 text-primary-foreground text-xs">
              VEG
            </Badge>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-medium text-sm leading-tight line-clamp-2">{product.name}</h3>
          <div className="text-right shrink-0">
            <span className="font-bold text-primary">₹{product.price}</span>
            {product.originalPrice && (
              <span className="block text-xs text-muted-foreground line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
        <Button
          onClick={() => addToCart(product)}
          className="w-full"
          size="sm"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
