import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, ShoppingCart, Eye, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import type { Tables, Json } from '@/integrations/supabase/types';
import { formatPrice } from '@/components/products/ProductCard';

type Order = Tables<'orders'>;

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  notes?: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  paid: 'bg-blue-500',
  processing: 'bg-purple-500',
  shipped: 'bg-indigo-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const statusOptions = [
  { value: 'pending', label: 'Pending Payment' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const Orders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        logger.error("Failed to fetch orders", error.message);
        throw error;
      }
      return data as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: (_, { orderId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      logger.info("Order status updated", `${orderId} -> ${status}`);
      toast({
        title: 'Status updated',
        description: `Order status changed to ${status}`,
      });
    },
    onError: (error: any, { orderId }) => {
      logger.error("Failed to update order status", `${orderId} - ${error.message}`);
      toast({
        title: 'Update failed',
        description: 'Could not update order status.',
        variant: 'destructive',
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Order ID copied to clipboard.' });
  };

  const parseItems = (items: Json): OrderItem[] => {
    if (Array.isArray(items)) {
      return items as unknown as OrderItem[];
    }
    return [];
  };

  const parseAddress = (address: Json): ShippingAddress => {
    if (typeof address === 'object' && address !== null && !Array.isArray(address)) {
      return address as unknown as ShippingAddress;
    }
    return { address: '', city: '', postalCode: '', phone: '' };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-pixel text-3xl text-foreground mb-2">Orders</h1>
          <p className="text-muted-foreground font-retro">
            Manage customer orders and update payment status
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : orders?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Orders will appear here when customers place them
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="border rounded-lg border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-retro">Order ID</TableHead>
                  <TableHead className="font-retro">Customer</TableHead>
                  <TableHead className="font-retro">Total</TableHead>
                  <TableHead className="font-retro">Status</TableHead>
                  <TableHead className="font-retro">Date</TableHead>
                  <TableHead className="font-retro">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => {
                  const items = parseItems(order.items);
                  const address = parseAddress(order.shipping_address);
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-primary">
                            {order.id}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(order.id)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status || 'pending'}
                          onValueChange={(value) =>
                            updateStatusMutation.mutate({ orderId: order.id, status: value })
                          }
                        >
                          <SelectTrigger className="w-36">
                            <Badge className={statusColors[order.status || 'pending']}>
                              {order.status || 'pending'}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(order.created_at), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="font-pixel">
                                Order: {order.id}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Customer Info */}
                              <div>
                                <h4 className="font-retro font-semibold mb-2">Customer Details</h4>
                                <div className="bg-muted p-4 rounded-md space-y-1 text-sm">
                                  <p><strong>Name:</strong> {order.customer_name}</p>
                                  <p><strong>Email:</strong> {order.customer_email}</p>
                                  <p><strong>Phone:</strong> {address.phone}</p>
                                </div>
                              </div>

                              {/* Shipping */}
                              <div>
                                <h4 className="font-retro font-semibold mb-2">Shipping Address</h4>
                                <div className="bg-muted p-4 rounded-md space-y-1 text-sm">
                                  <p>{address.address}</p>
                                  <p>{address.city}, {address.postalCode}</p>
                                  {address.notes && (
                                    <p className="text-muted-foreground mt-2">
                                      <strong>Notes:</strong> {address.notes}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Items */}
                              <div>
                                <h4 className="font-retro font-semibold mb-2">Order Items</h4>
                                <div className="space-y-2">
                                  {items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between items-center bg-muted p-3 rounded-md"
                                    >
                                      <div className="flex items-center gap-3">
                                        {item.image && (
                                          <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded"
                                          />
                                        )}
                                        <div>
                                          <p className="font-medium">{item.name}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {item.size} / {item.color} × {item.quantity}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-semibold">
                                        {formatPrice(item.price * item.quantity)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>


                              {/* Total */}
                              <div className="border-t pt-4">
                                <div className="flex justify-between text-lg">
                                  <span className="font-pixel">TOTAL</span>
                                  <span className="font-pixel text-primary">
                                    {formatPrice(Number(order.total_amount))}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
