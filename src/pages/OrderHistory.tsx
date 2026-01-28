import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Package, 
  RefreshCw, 
  Calendar, 
  ShoppingCart,
  ArrowLeft,
  TrendingUp,
  Clock
} from 'lucide-react';
import { products } from '@/data/products';
import { toast } from 'sonner';

interface PurchaseRecord {
  id: string;
  product_id: string;
  product_name: string;
  category: string;
  quantity: number;
  price: number;
  purchased_at: string;
}

interface GroupedOrder {
  date: string;
  items: PurchaseRecord[];
  total: number;
}

export default function OrderHistory() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [frequentItems, setFrequentItems] = useState<{ product_id: string; product_name: string; count: number }[]>([]);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchOrderHistory();
    }
  }, [user]);

  const fetchOrderHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('purchased_at', { ascending: false });

      if (error) throw error;

      setPurchases(data || []);

      // Calculate frequent items
      const frequency: Record<string, { product_name: string; count: number }> = {};
      for (const p of data || []) {
        if (!frequency[p.product_id]) {
          frequency[p.product_id] = { product_name: p.product_name, count: 0 };
        }
        frequency[p.product_id].count += p.quantity || 1;
      }

      const sorted = Object.entries(frequency)
        .map(([product_id, data]) => ({ product_id, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setFrequentItems(sorted);
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group purchases by date
  const groupedOrders: GroupedOrder[] = purchases.reduce((acc, purchase) => {
    const date = new Date(purchase.purchased_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const existing = acc.find(g => g.date === date);
    if (existing) {
      existing.items.push(purchase);
      existing.total += purchase.price * (purchase.quantity || 1);
    } else {
      acc.push({
        date,
        items: [purchase],
        total: purchase.price * (purchase.quantity || 1),
      });
    }
    return acc;
  }, [] as GroupedOrder[]);

  const handleReorder = (item: PurchaseRecord) => {
    const product = products.find(p => p.id === item.product_id);
    if (product) {
      for (let i = 0; i < (item.quantity || 1); i++) {
        addToCart(product);
      }
      toast.success(`Added ${item.product_name} to cart`, {
        description: `Quantity: ${item.quantity || 1}`,
      });
    } else {
      toast.error('Product not available');
    }
  };

  const handleReorderAll = (items: PurchaseRecord[]) => {
    let addedCount = 0;
    for (const item of items) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        for (let i = 0; i < (item.quantity || 1); i++) {
          addToCart(product);
        }
        addedCount++;
      }
    }
    toast.success(`Added ${addedCount} items to cart`);
  };

  const handleQuickReorder = (productId: string, productName: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product);
      toast.success(`Added ${productName} to cart`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/shop')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order History</h1>
            <p className="text-sm text-muted-foreground">
              {purchases.length} items purchased
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={fetchOrderHistory}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Frequently Ordered Quick Actions */}
      {frequentItems.length > 0 && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Quick Reorder - Your Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {frequentItems.map(item => (
                <Button
                  key={item.product_id}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickReorder(item.product_id, item.product_name)}
                  className="gap-2"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  {item.product_name}
                  <Badge variant="outline" className="ml-1 text-xs">
                    {item.count}x
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {purchases.length === 0 && (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-semibold">No orders yet</h3>
              <p className="text-muted-foreground">
                Start shopping to see your order history here
              </p>
            </div>
            <Button onClick={() => navigate('/shop')}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Grouped Orders */}
      <div className="space-y-4">
        {groupedOrders.map((order, idx) => (
          <Card key={idx} className="overflow-hidden">
            <CardHeader className="bg-muted/30 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{order.date}</span>
                  <Badge variant="secondary" className="text-xs">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-primary">
                    ₹{order.total.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReorderAll(order.items)}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Reorder All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity || 1}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(item.purchased_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReorder(item)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
