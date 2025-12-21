import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Grid, List } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useProducts, useCategories } from "@/hooks/useProducts";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("category") || undefined;
  const showSaleOnly = searchParams.get("sale") === "true";
  
  const { data: products, isLoading } = useProducts(categorySlug);
  const { data: categories } = useCategories();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = showSaleOnly
    ? products?.filter((p) => p.is_on_sale)
    : products;

  const handleCategoryChange = (slug: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set("category", slug);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleSaleToggle = () => {
    const newParams = new URLSearchParams(searchParams);
    if (showSaleOnly) {
      newParams.delete("sale");
    } else {
      newParams.set("sale", "true");
    }
    setSearchParams(newParams);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 md:py-20 gradient-blue relative">
        <div className="absolute inset-0 scanlines" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-pixel text-2xl md:text-4xl text-secondary-foreground text-center mb-4">
            SHOP ALL
          </h1>
          <p className="font-retro text-xl md:text-2xl text-secondary-foreground/80 text-center">
            Browse our complete collection of gaming-inspired streetwear
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-border">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={!categorySlug ? "default" : "outline"}
                onClick={() => handleCategoryChange(null)}
                className={`font-retro text-base ${
                  !categorySlug
                    ? "bg-bread-black text-bread-white"
                    : "border-2 border-bread-black text-bread-black hover:bg-bread-black hover:text-bread-white"
                }`}
              >
                All
              </Button>
              {categories?.map((cat) => (
                <Button
                  key={cat.id}
                  variant={categorySlug === cat.slug ? "default" : "outline"}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`font-retro text-base ${
                    categorySlug === cat.slug
                      ? "bg-bread-black text-bread-white"
                      : "border-2 border-bread-black text-bread-black hover:bg-bread-black hover:text-bread-white"
                  }`}
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant={showSaleOnly ? "default" : "outline"}
                onClick={handleSaleToggle}
                className={`font-retro text-base ${
                  showSaleOnly
                    ? "bg-primary text-primary-foreground"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Sale Only
              </Button>

              <div className="hidden md:flex items-center gap-2 border-2 border-border p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-muted" : ""}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-muted" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="font-retro text-lg text-muted-foreground mb-6">
            Showing {filteredProducts?.length || 0} products
          </p>

          {/* Products Grid */}
          {isLoading ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted animate-pulse pixel-border"
                />
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={Number(product.price)}
                  originalPrice={
                    product.original_price ? Number(product.original_price) : null
                  }
                  imageUrl={product.image_url}
                  isOnSale={product.is_on_sale ?? false}
                  isFeatured={product.is_featured ?? false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-pixel text-xl text-muted-foreground mb-4">
                NO PRODUCTS FOUND
              </p>
              <p className="font-retro text-lg text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
