import { mockOrders } from '@/data/orders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Navigation, Package, Clock, CheckCircle } from 'lucide-react';

export default function DeliveryDashboard() {
  const currentOrder = mockOrders.find(o => o.status === 'out_for_delivery');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
          <p className="text-muted-foreground">Manage your deliveries and routes</p>
        </div>
        <Button>
          <Navigation className="h-4 w-4 mr-2" />
          Optimize Route
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current Delivery */}
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Current Delivery</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentOrder ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Order #{currentOrder.id}</span>
                      <Badge className="bg-warning/20 text-warning border-warning/30">In Transit</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{currentOrder.address}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium text-sm">PICKUP</p>
                      <p className="text-sm text-muted-foreground">Fresh Market Store 1</p>
                      <p className="text-xs text-primary">Completed 2:15 PM</p>
                    </div>
                  </div>
                  <div className="ml-1 h-6 border-l-2 border-dashed border-muted-foreground/30" />
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">DROPOFF</p>
                      <p className="text-sm text-muted-foreground">{currentOrder.customerName}</p>
                      <p className="text-xs text-muted-foreground">Est. 2:45 PM</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Delivered
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Customer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No active deliveries</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className="card-elevated min-h-[400px]">
          <CardContent className="p-0 h-full">
            <div className="h-full bg-muted/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Live Tracking Active</p>
                <p className="text-xs text-muted-foreground mt-1">Map integration ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deliveries */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Deliveries</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockOrders.filter(o => o.status === 'delivered').map(order => (
            <Card key={order.id} className="card-elevated">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">#{order.id}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Delivered
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{order.customerName}</p>
                <p className="text-xs text-muted-foreground mt-1">{order.address}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
