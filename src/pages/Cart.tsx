import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/components/products/ProductCard";

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-pixel text-2xl text-foreground mb-4">
            YOUR CART IS EMPTY
          </h1>
          <p className="font-retro text-xl text-muted-foreground mb-8">
            Time to level up your wardrobe!
          </p>
          <Link to="/shop">
            <Button className="font-pixel text-sm bg-primary text-primary-foreground retro-shadow hover-lift px-8 py-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              START SHOPPING
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="font-pixel text-2xl md:text-3xl text-foreground mb-8">
          YOUR CART
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 md:gap-6 bg-card pixel-border retro-shadow-sm p-4"
              >
                {/* Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-muted overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <span className="font-pixel text-xs text-secondary-foreground">
                        IMG
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-retro text-xl text-card-foreground mb-1 truncate">
                    {item.name}
                  </h3>
                  <p className="font-retro text-base text-muted-foreground mb-2">
                    {item.size} / {item.color}
                  </p>
                  <p className="font-pixel text-sm text-primary">
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border-2 border-bread-black">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="h-8 w-8 rounded-none hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-retro text-lg w-10 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="h-8 w-8 rounded-none hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-pixel text-sm text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <Button
              variant="outline"
              onClick={clearCart}
              className="font-retro text-base border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card pixel-border retro-shadow p-6 sticky top-24">
              <h2 className="font-pixel text-lg text-card-foreground mb-6">
                ORDER SUMMARY
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between font-retro text-lg">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-card-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between font-retro text-lg">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-card-foreground">
                    {shipping === 0 ? "FREE" : `${formatPrice(shipping)}`}
                  </span>
                </div>
                {subtotal < 100 && (
                  <p className="font-retro text-sm text-accent">
                    Add {formatPrice(100 - subtotal)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t-2 border-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-pixel text-sm text-card-foreground">
                    TOTAL
                  </span>
                  <span className="font-pixel text-lg text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full font-pixel text-sm bg-primary text-primary-foreground py-6 retro-shadow hover-lift mb-4"
                disabled
              >
                CHECKOUT
              </Button>
              <p className="font-retro text-sm text-muted-foreground text-center">
                Payment integration coming soon!
              </p>

              <Link to="/shop">
                <Button
                  variant="outline"
                  className="w-full mt-4 font-retro text-base border-2 border-bread-black text-bread-black hover:bg-bread-black hover:text-bread-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
