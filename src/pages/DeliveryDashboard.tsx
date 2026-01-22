import { useState } from 'react';
import { mockOrders } from '@/data/orders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Package, 
  Clock, 
  CheckCircle,
  Truck,
  User,
  MessageCircle,
  Route,
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const deliveryTasks = [
  {
    id: 'ORD-8821',
    customerName: 'Alex User',
    address: '123 Innovation Dr, Tech City',
    distance: '2.5 km',
    eta: '15 min',
    status: 'in_transit',
    items: 3,
    total: 252,
  },
  {
    id: 'ORD-8822',
    customerName: 'Priya Sharma',
    address: '456 Market St, Downtown',
    distance: '4.2 km',
    eta: '25 min',
    status: 'pending',
    items: 5,
    total: 480,
  },
  {
    id: 'ORD-8823',
    customerName: 'Rahul Verma',
    address: '789 Oak Ave, Suburb',
    distance: '3.8 km',
    eta: '20 min',
    status: 'pending',
    items: 2,
    total: 180,
  },
];

const completedDeliveries = [
  { id: 'ORD-8819', customer: 'Mike Johnson', time: '11:30 AM', rating: 5 },
  { id: 'ORD-8818', customer: 'Sarah Lee', time: '10:15 AM', rating: 4 },
  { id: 'ORD-8817', customer: 'David Chen', time: '09:45 AM', rating: 5 },
];

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedOrder, setSelectedOrder] = useState(deliveryTasks[0]);

  const sidebarItems = [
    { id: 'active', label: 'Active Deliveries', icon: Truck, count: deliveryTasks.length },
    { id: 'completed', label: 'Completed Orders', icon: CheckCircle, count: completedDeliveries.length },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Menu */}
      <aside className="hidden lg:flex w-56 flex-col border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">Delivery Hub</h2>
          <p className="text-xs text-muted-foreground">Partner Dashboard</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.count && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* Today's Stats */}
        <div className="p-3 border-t">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-2">Today's Earnings</p>
            <p className="text-xl font-bold text-primary">₹1,240</p>
            <p className="text-xs text-muted-foreground mt-1">8 deliveries completed</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
            <p className="text-muted-foreground">Manage your deliveries and optimize routes</p>
          </div>
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            <Route className="h-4 w-4" />
            Optimize Route
          </Button>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Delivery Task List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              Active Orders ({deliveryTasks.length})
            </h3>
            
            {deliveryTasks.map((task, index) => (
              <Card 
                key={task.id} 
                className={`card-elevated cursor-pointer transition-all ${
                  selectedOrder?.id === task.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedOrder(task)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">#{task.id}</span>
                        <Badge 
                          variant={task.status === 'in_transit' ? 'default' : 'secondary'}
                          className={task.status === 'in_transit' ? 'bg-warning text-warning-foreground' : ''}
                        >
                          {task.status === 'in_transit' ? 'In Transit' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{task.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹{task.total}</p>
                      <p className="text-xs text-muted-foreground">{task.items} items</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{task.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <Route className="h-3 w-3" />
                        {task.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ETA: {task.eta}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live Map Panel */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="card-elevated h-[400px]">
              <CardContent className="p-0 h-full relative">
                <div className="h-full bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-primary opacity-50" />
                    <p className="font-medium">Live Tracking Active</p>
                    <p className="text-xs text-muted-foreground mt-1">Real-time route visualization</p>
                  </div>
                </div>
                
                {/* Map Overlay Controls */}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse mr-2" />
                    GPS Active
                  </Badge>
                  <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur">
                    <Navigation className="h-4 w-4 mr-1" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Status Actions */}
            {selectedOrder && (
              <Card className="card-elevated">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Order #{selectedOrder.id} - Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{selectedOrder.customerName}</p>
                      <p className="text-xs text-muted-foreground">{selectedOrder.address}</p>
                    </div>
                  </div>

                  {/* Order Status Flow */}
                  <div className="flex items-center justify-between mb-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span>Picked Up</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        selectedOrder.status === 'in_transit' ? 'bg-warning' : 'bg-muted'
                      }`}>
                        <Truck className={`h-3 w-3 ${
                          selectedOrder.status === 'in_transit' ? 'text-warning-foreground' : ''
                        }`} />
                      </div>
                      <span>In Transit</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                        <Package className="h-3 w-3" />
                      </div>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Delivered
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Customer
                    </Button>
                  </div>
                  
                  {/* Customer Contact Panel */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Quick Contact</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completed Deliveries */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            Today's Completed ({completedDeliveries.length})
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedDeliveries.map(delivery => (
              <Card key={delivery.id} className="card-elevated">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">#{delivery.id}</span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Delivered
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{delivery.customer}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {delivery.time}
                    </span>
                    <span className="flex items-center gap-1">
                      {'★'.repeat(delivery.rating)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
