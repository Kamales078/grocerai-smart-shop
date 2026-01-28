import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle, CreditCard, Wallet, Banknote, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const trackPurchases = async () => {
    if (!user) return;
    
    try {
      const purchases = items.map(item => ({
        user_id: user.id,
        product_id: item.product.id,
        product_name: item.product.name,
        category: item.product.category,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await supabase.from('user_purchases').insert(purchases);

      // Also track as cart purchase action
      const cartActions = items.map(item => ({
        user_id: user.id,
        product_id: item.product.id,
        product_name: item.product.name,
        category: item.product.category,
        action: 'purchased',
        quantity: item.quantity,
      }));

      await supabase.from('user_cart_history').insert(cartActions);
    } catch (error) {
      console.error('Failed to track purchases:', error);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Track purchases for recommendations
    await trackPurchases();
    
    setIsProcessing(false);
    setIsComplete(true);
    clearCart();
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="card-elevated max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6 space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Order Confirmed!</h2>
            <p className="text-muted-foreground">Thank you for your purchase.</p>
            
            <div className="p-4 bg-muted/50 rounded-lg text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium">ORD-{Date.now().toString().slice(-4)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Invoice has been sent to your email.
            </p>

            <Button onClick={() => navigate('/shop')} className="w-full" size="lg">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/shop')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </Button>

      <div className="max-w-lg mx-auto">
        <Card className="card-elevated">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <span>Secure Payment</span>
            </CardTitle>
            <p className="text-3xl font-bold">₹{total.toFixed(2)}</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Payment Method</label>
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upi" className="flex flex-col gap-1 py-2">
                    <Wallet className="h-4 w-4" />
                    <span className="text-xs">UPI</span>
                  </TabsTrigger>
                  <TabsTrigger value="card" className="flex flex-col gap-1 py-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs">Card</span>
                  </TabsTrigger>
                  <TabsTrigger value="cash" className="flex flex-col gap-1 py-2">
                    <Banknote className="h-4 w-4" />
                    <span className="text-xs">Cash</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upi" className="mt-4">
                  <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                    <div className="h-32 w-32 bg-background border rounded-lg flex items-center justify-center mb-3">
                      <div className="text-center text-xs text-muted-foreground">
                        QR Code
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Scan to pay via UPI</p>
                  </div>
                </TabsContent>

                <TabsContent value="card" className="mt-4">
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Card payment integration coming soon
                  </p>
                </TabsContent>

                <TabsContent value="cash" className="mt-4">
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Pay cash on delivery
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="pt-4 border-t">
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              className="w-full"
              size="lg"
              disabled={isProcessing || items.length === 0}
            >
              {isProcessing ? 'Processing...' : 'I Have Paid'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
