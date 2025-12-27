import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";
import { Loader2, CheckCircle, Copy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

interface OrderConfirmation {
  orderNumber: string;
  total: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BRD-${timestamp}-${random}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();
      
      const orderItems = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        image: item.image,
      }));

      const shippingAddress = {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone,
        notes: formData.notes,
      };

      const { error } = await supabase.from("orders").insert({
        order_number: orderNumber,
        customer_name: formData.name,
        customer_email: formData.email,
        items: orderItems,
        shipping_address: shippingAddress,
        total_amount: total,
        status: "pending",
      });

      if (error) {
        logger.error("Order creation failed", `Order: ${orderNumber}, Error: ${error.message}`);
        throw error;
      }

      logger.info("New order created", `Order: ${orderNumber}, Total: R${total}`);
      
      setOrderConfirmation({ orderNumber, total });
      clearCart();
      
      toast({
        title: "Order placed!",
        description: `Your order ${orderNumber} has been received.`,
      });
    } catch (error: any) {
      logger.error("Checkout error", error.message || "Unknown error");
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Reference copied to clipboard.",
    });
  };

//   useEffect(() => {
//     if (items.length === 0 && !orderConfirmation) {
//       navigate("/cart", { replace: true });
//     }
//   }, [items])

//   if (items.length === 0 && !orderConfirmation) {
//     navigate("/cart");
//     return null;
//   }

  // Order confirmation view
  if (orderConfirmation) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="font-pixel text-2xl md:text-3xl text-foreground mb-2">
              ORDER CONFIRMED!
            </h1>
            <p className="font-retro text-lg text-muted-foreground">
              Thank you for your order
            </p>
          </div>

          <Card className="pixel-border retro-shadow mb-6">
            <CardHeader>
              <CardTitle className="font-pixel text-lg">ORDER DETAILS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-retro text-muted-foreground">Order Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-primary">
                    {orderConfirmation.orderNumber}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(orderConfirmation.orderNumber)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-retro text-muted-foreground">Total Amount:</span>
                <span className="font-pixel text-lg text-foreground">
                  R{orderConfirmation.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-retro text-muted-foreground">Status:</span>
                <span className="font-retro text-yellow-600 font-semibold">
                  Awaiting Payment
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="pixel-border retro-shadow bg-accent/10 mb-6">
            <CardHeader>
              <CardTitle className="font-pixel text-lg text-accent">
                PAYMENT INSTRUCTIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-retro text-base text-foreground">
                Please make an EFT payment to the following account:
              </p>
              
              <div className="bg-card p-4 rounded-md space-y-2 border border-border">
                <div className="flex justify-between">
                  <span className="font-retro text-muted-foreground">Bank:</span>
                  <span className="font-retro font-semibold">First National Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-retro text-muted-foreground">Account Name:</span>
                  <span className="font-retro font-semibold">BREAD Clothing</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-retro text-muted-foreground">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">62123456789</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard("62123456789")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-retro text-muted-foreground">Branch Code:</span>
                  <span className="font-mono font-semibold">250655</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-retro text-muted-foreground">Reference:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary">
                      {orderConfirmation.orderNumber}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(orderConfirmation.orderNumber)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-retro text-muted-foreground">Amount:</span>
                  <span className="font-pixel text-primary font-bold">
                    R{orderConfirmation.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-md">
                <p className="font-retro text-sm text-yellow-700 dark:text-yellow-400">
                  <strong>Important:</strong> Use your order number as the payment reference. 
                  Your order will be processed once payment is confirmed by our team.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Link to="/shop" className="flex-1">
              <Button variant="outline" className="w-full font-retro">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Checkout form view
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="font-pixel text-2xl md:text-3xl text-foreground mb-8">
          CHECKOUT
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customer Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="pixel-border retro-shadow">
                <CardHeader>
                  <CardTitle className="font-pixel text-lg">SHIPPING DETAILS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-retro">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="font-retro"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-retro">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="font-retro"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-retro">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="font-retro"
                      placeholder="071 234 5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-retro">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="font-retro"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="font-retro">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="font-retro"
                        placeholder="Johannesburg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="font-retro">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="font-retro"
                        placeholder="2000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="font-retro">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="font-retro"
                      placeholder="Special delivery instructions..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="pixel-border retro-shadow sticky top-24">
                <CardHeader>
                  <CardTitle className="font-pixel text-lg">ORDER SUMMARY</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="font-retro text-muted-foreground">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-retro">
                          R{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between font-retro">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>R{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-retro">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? "FREE" : `R${shipping.toFixed(2)}`}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="font-pixel text-sm">TOTAL</span>
                      <span className="font-pixel text-lg text-primary">
                        R{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full font-pixel text-sm bg-primary text-primary-foreground py-6 retro-shadow hover-lift"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        PLACING ORDER...
                      </>
                    ) : (
                      "PLACE ORDER"
                    )}
                  </Button>

                  <p className="font-retro text-xs text-muted-foreground text-center">
                    You will receive payment instructions after placing your order
                  </p>

                  <Link to="/cart">
                    <Button variant="outline" className="w-full font-retro text-sm">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Cart
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
