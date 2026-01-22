import { useState } from 'react';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Pencil, 
  AlertTriangle, 
  Package, 
  ClipboardList, 
  Tag, 
  BarChart3, 
  Settings, 
  TrendingUp,
  TrendingDown,
  Sparkles,
  DollarSign,
  ShoppingCart,
  Trash2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';

const salesData = [
  { day: 'Mon', sales: 4200, orders: 42 },
  { day: 'Tue', sales: 5800, orders: 58 },
  { day: 'Wed', sales: 4900, orders: 49 },
  { day: 'Thu', sales: 6200, orders: 62 },
  { day: 'Fri', sales: 7500, orders: 75 },
  { day: 'Sat', sales: 8200, orders: 82 },
  { day: 'Sun', sales: 5400, orders: 54 },
];

const lowStockProducts = products.filter(p => p.stock < 40);

export default function StoreDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarItems = [
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayRevenue = salesData.reduce((sum, d) => sum + d.sales, 0);
  const todayOrders = salesData.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Menu */}
      <aside className="hidden lg:flex w-56 flex-col border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">KR MARKET</h2>
          <p className="text-xs text-muted-foreground">Store Dashboard</p>
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
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Store Management</h1>
            <p className="text-muted-foreground">Manage products, inventory, and track performance</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Sales Dashboard Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="card-elevated">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Weekly Revenue</span>
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">₹{todayRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-primary mt-1">
                <TrendingUp className="h-3 w-3" />
                +12.5% from last week
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Orders</span>
                <ShoppingCart className="h-4 w-4 text-chart-4" />
              </div>
              <p className="text-2xl font-bold">{todayOrders}</p>
              <div className="flex items-center gap-1 text-xs text-primary mt-1">
                <TrendingUp className="h-3 w-3" />
                +8.2% from last week
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Low Stock Items</span>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
              <p className="text-2xl font-bold">{lowStockProducts.length}</p>
              <p className="text-xs text-warning mt-1">Needs attention</p>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Offers</span>
                <Tag className="h-4 w-4 text-chart-3" />
              </div>
              <p className="text-2xl font-bold">{products.filter(p => p.originalPrice).length}</p>
              <p className="text-xs text-muted-foreground mt-1">Products on sale</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Sales Chart */}
          <Card className="card-elevated lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Stock Alerts Panel */}
          <Card className="card-elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockProducts.slice(0, 4).map(product => (
                  <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg bg-warning/10 border border-warning/20">
                    <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-warning">Only {product.stock} left</p>
                    </div>
                    <Button size="sm" variant="outline">Restock</Button>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">All stock levels healthy!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Demand Insights */}
        <Card className="card-elevated mb-6 border-l-4 border-l-primary">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium flex items-center gap-2">
                  AI Demand Insights
                  <Badge variant="secondary" className="text-xs">Smart Prediction</Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on seasonal trends and purchase patterns:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    <strong>Strawberries</strong> demand expected to increase by 40% this weekend
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    <strong>Croissants</strong> trending up 25% - consider bulk order
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingDown className="h-3 w-3 text-muted-foreground" />
                    <strong>Winter vegetables</strong> demand decreasing - reduce stock
                  </li>
                </ul>
              </div>
              <Button size="sm">Apply Suggestions</Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="card-elevated overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-medium">Product Inventory ({products.length} items)</h3>
            <Input 
              placeholder="Search products..." 
              className="max-w-xs" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Offers</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={product.stock < 30 ? 'destructive' : 'secondary'}
                      className={product.stock < 30 ? '' : 'bg-primary/10 text-primary'}
                    >
                      {product.stock < 30 && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">₹{product.price}</TableCell>
                  <TableCell className="text-center">
                    {product.originalPrice ? (
                      <Badge className="bg-warning/20 text-warning border-warning/30">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
