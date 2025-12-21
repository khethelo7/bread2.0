import { Link } from "react-router-dom";
import { ArrowRight, Zap, Star, Gamepad2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useFeaturedProducts, useProducts } from "@/hooks/useProducts";

const Index = () => {
  const { data: featuredProducts, isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: saleProducts } = useProducts();
  const onSaleProducts = saleProducts?.filter((p) => p.is_on_sale).slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center gradient-hero overflow-hidden">
        <div className="absolute inset-0 scanlines" />
        
        {/* Pixel Art Decorations */}
        <div className="absolute top-10 right-10 md:top-20 md:right-20 animate-float">
          <Gamepad2 className="h-16 w-16 md:h-24 md:w-24 text-accent/50" />
        </div>
        <div className="absolute bottom-20 left-10 animate-float" style={{ animationDelay: "1s" }}>
          <Star className="h-12 w-12 md:h-16 md:w-16 text-accent/50" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-block bg-accent text-accent-foreground font-pixel text-xs px-4 py-2 mb-6 retro-shadow-sm">
              <Zap className="inline h-4 w-4 mr-2" />
              UP TO 50% OFF - LIMITED TIME
            </div>
            
            <h1 className="font-pixel text-3xl md:text-5xl lg:text-6xl text-primary-foreground mb-6 leading-tight">
              LEVEL UP
              <br />
              YOUR STYLE
            </h1>
            
            <p className="font-retro text-2xl md:text-3xl text-primary-foreground/90 mb-8">
              Retro gaming meets streetwear. Pixel-perfect fashion for the modern player.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button
                  size="lg"
                  className="bg-bread-black text-bread-white font-pixel text-sm px-8 py-6 retro-shadow hover-lift hover:bg-bread-black"
                >
                  SHOP NOW
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-4 border-bread-white text-bread-white font-pixel text-sm px-8 py-6 hover:bg-bread-white hover:text-primary"
                >
                  OUR STORY
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-pixel text-xl md:text-2xl text-foreground mb-4">
              FEATURED DROPS
            </h2>
            <p className="font-retro text-xl text-muted-foreground">
              Our hottest picks for true gamers
            </p>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted animate-pulse pixel-border"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={Number(product.price)}
                  originalPrice={product.original_price ? Number(product.original_price) : null}
                  imageUrl={product.image_url}
                  isOnSale={product.is_on_sale ?? false}
                  isFeatured={product.is_featured ?? false}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button
                variant="outline"
                size="lg"
                className="font-pixel text-sm border-4 border-bread-black text-bread-black hover:bg-bread-black hover:text-bread-white retro-shadow hover-lift"
              >
                VIEW ALL PRODUCTS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="py-16 gradient-blue relative overflow-hidden">
        <div className="absolute inset-0 scanlines" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="font-pixel text-2xl md:text-3xl text-secondary-foreground mb-4">
              🎮 PLAYER SALE 🎮
            </h2>
            <p className="font-retro text-2xl text-secondary-foreground/80 mb-8">
              Score big discounts on select items
            </p>
            <Link to="/shop?sale=true">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground font-pixel text-sm px-8 py-6 retro-shadow hover-lift hover:bg-accent/90"
              >
                SHOP THE SALE
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* On Sale Products */}
      {onSaleProducts && onSaleProducts.length > 0 && (
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-pixel text-xl md:text-2xl text-foreground mb-4">
                HOT DEALS
              </h2>
              <p className="font-retro text-xl text-muted-foreground">
                Limited time offers - grab them before they're gone!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {onSaleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={Number(product.price)}
                  originalPrice={product.original_price ? Number(product.original_price) : null}
                  imageUrl={product.image_url}
                  isOnSale={product.is_on_sale ?? false}
                  isFeatured={product.is_featured ?? false}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20 bg-bread-black">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-pixel text-xl md:text-2xl text-bread-white mb-4">
              JOIN THE PARTY
            </h2>
            <p className="font-retro text-xl text-bread-white/70 mb-8">
              Get exclusive drops, early access, and gaming tips straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-bread-white/10 border-2 border-bread-white/30 text-bread-white font-retro text-lg placeholder:text-bread-white/50 focus:outline-none focus:border-primary"
              />
              <Button
                type="submit"
                className="bg-primary text-primary-foreground font-pixel text-sm px-6 py-3 retro-shadow hover-lift"
              >
                SUBSCRIBE
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
