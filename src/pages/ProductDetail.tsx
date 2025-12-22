import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/components/products/ProductCard";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted animate-pulse pixel-border" />
            <div className="space-y-6">
              <div className="h-10 bg-muted animate-pulse w-3/4" />
              <div className="h-8 bg-muted animate-pulse w-1/4" />
              <div className="h-24 bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-pixel text-2xl text-foreground mb-4">
            PRODUCT NOT FOUND
          </h1>
          <p className="font-retro text-xl text-muted-foreground mb-8">
            This item may have been removed or doesn't exist
          </p>
          <Link to="/shop">
            <Button className="font-pixel text-sm bg-bread-black text-bread-white retro-shadow hover-lift">
              <ArrowLeft className="mr-2 h-4 w-4" />
              BACK TO SHOP
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    if (!selectedColor && product.colors && product.colors.length > 0) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url || "",
      size: selectedSize || "One Size",
      color: selectedColor || "Default",
      quantity,
    });

    setAdded(true);
    toast({
      title: "Added to cart!",
      description: `${product.name} x ${quantity}`,
    });

    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <Link
          to="/shop"
          className="inline-flex items-center font-retro text-lg text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <div className="relative aspect-square pixel-border retro-shadow overflow-hidden bg-muted">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <span className="font-pixel text-secondary-foreground">
                  NO IMAGE
                </span>
              </div>
            )}
            {product.is_on_sale && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-pixel text-sm px-4 py-2">
                SALE
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <Link
                to={`/shop?category=${product.category.slug}`}
                className="inline-block font-retro text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                {product.category.name}
              </Link>
            )}

            {/* Name */}
            <h1 className="font-pixel text-xl md:text-2xl text-foreground">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="font-pixel text-2xl text-primary">
                {formatPrice(product.price)}
              </span>
              {product.original_price && Number(product.original_price) > Number(product.price) && (
                <span className="font-retro text-2xl text-muted-foreground line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-retro text-xl text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-pixel text-xs text-foreground mb-3">SIZE</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className={`font-retro text-base min-w-[60px] ${
                        selectedSize === size
                          ? "bg-bread-black text-bread-white"
                          : "border-2 border-bread-black text-bread-black hover:bg-bread-black hover:text-bread-white"
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-pixel text-xs text-foreground mb-3">COLOR</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                      className={`font-retro text-base ${
                        selectedColor === color
                          ? "bg-bread-black text-bread-white"
                          : "border-2 border-bread-black text-bread-black hover:bg-bread-black hover:text-bread-white"
                      }`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-pixel text-xs text-foreground mb-3">QUANTITY</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-bread-black">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-none hover:bg-muted"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-retro text-xl w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-none hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full font-pixel text-sm py-6 retro-shadow hover-lift ${
                added
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {added ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  ADDED!
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  ADD TO CART
                </>
              )}
            </Button>

            {/* Stock Info */}
            {product.stock_quantity !== null && product.stock_quantity < 10 && (
              <p className="font-retro text-lg text-primary">
                Only {product.stock_quantity} left in stock!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
