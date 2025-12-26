import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Image, MessageSquare, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { logger } from '@/lib/logger';

const Dashboard = () => {
  const { data: productCount } = useQuery({
    queryKey: ['admin-product-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      if (error) logger.warn('Product count failed', error.message);
      return count || 0;
    },
  });

  const { data: mediaCount } = useQuery({
    queryKey: ['admin-media-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('media')
        .select('*', { count: 'exact', head: true });
      if (error) logger.warn('Media count failed', error.message);
      return count || 0;
    },
  });

  const { data: messageCount } = useQuery({
    queryKey: ['admin-message-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      if (error) logger.warn('Message count failed', error.message);
      return count || 0;
    },
  });

  const { data: orderCount } = useQuery({
    queryKey: ['admin-order-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      if (error) logger.warn('Order count failed', error.message);
      return count || 0;
    },
  });

  // Traffic stats
  const { data: todayViews } = useQuery({
    queryKey: ['admin-today-views'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count, error } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());
      if (error) logger.warn('Today views fetch failed', error.message);
        return count || 0;
      }
  });

  const { data: weekViews } = useQuery({
    queryKey: ['admin-week-views'],
    queryFn: async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count, error } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString())
      if (error) logger.warn('Week views fetch failed', error.message);
        return count || 0;
      }
  });

  const { data: topPages } = useQuery({
    queryKey: ['admin-top-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('page_path')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        logger.warn('Top pages failed', error.message);
        return [];
      }

      // Count occurrences
      const counts: Record<string, number> = {};
      data?.forEach((row) => {
        counts[row.page_path] = (counts[row.page_path] || 0) + 1;
      });

      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }));
    },
  });

  const stats = [
    { label: 'Total Products', value: productCount ?? 0, icon: Package, color: 'text-bread-blue' },
    { label: 'Media Items', value: mediaCount ?? 0, icon: Image, color: 'text-bread-gold' },
    { label: 'Unread Messages', value: messageCount ?? 0, icon: MessageSquare, color: 'text-bread-red' },
    { label: 'Total Orders', value: orderCount ?? 0, icon: ShoppingCart, color: 'text-green-500' },
  ];

  const trafficStats = [
    { label: 'Today\'s Views', value: todayViews ?? 0, icon: Users, color: 'text-purple-500' },
    { label: 'This Week', value: weekViews ?? 0, icon: TrendingUp, color: 'text-blue-500' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-pixel text-3xl text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground font-retro">Welcome back to BREAD Admin</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-2 border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-retro text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="font-pixel text-3xl">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Traffic Stats */}
        <div>
          <h2 className="font-retro text-xl mb-4">User Traffic</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trafficStats.map((stat) => (
              <Card key={stat.label} className="border-2 border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-retro text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="font-pixel text-3xl">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
            
            {/* Top Pages */}
            <Card className="border-2 border-border sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-retro text-muted-foreground">
                  Top Pages (Recent)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {topPages?.length ? (
                    topPages.map((page) => (
                      <li key={page.path} className="flex justify-between font-retro">
                        <span className="truncate max-w-[150px]">{page.path}</span>
                        <span className="text-muted-foreground">{page.count}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No data yet</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-retro text-xl mb-4">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 border-border hover:border-primary transition-colors cursor-pointer">
              <a href="/admin/products/new">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-retro font-semibold">Add New Product</h3>
                    <p className="text-sm text-muted-foreground">Create a new product listing</p>
                  </div>
                </CardContent>
              </a>
            </Card>

            <Card className="border-2 border-border hover:border-primary transition-colors cursor-pointer">
              <a href="/admin/media">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-bread-gold/10">
                    <Image className="h-6 w-6 text-bread-gold" />
                  </div>
                  <div>
                    <h3 className="font-retro font-semibold">Manage Media</h3>
                    <p className="text-sm text-muted-foreground">Upload and organize images</p>
                  </div>
                </CardContent>
              </a>
            </Card>

            <Card className="border-2 border-border hover:border-primary transition-colors cursor-pointer">
              <a href="/admin/messages">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-bread-red/10">
                    <MessageSquare className="h-6 w-6 text-bread-red" />
                  </div>
                  <div>
                    <h3 className="font-retro font-semibold">View Messages</h3>
                    <p className="text-sm text-muted-foreground">Check customer inquiries</p>
                  </div>
                </CardContent>
              </a>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
