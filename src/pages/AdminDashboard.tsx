import { useState } from 'react';
import { mockAnalytics, mockOrders } from '@/data/orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  AlertTriangle, 
  DollarSign,
  Store,
  BarChart3,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Activity,
  Server,
  Search
} from 'lucide-react';

const userGrowthData = [
  { month: 'Jan', users: 4200 },
  { month: 'Feb', users: 5100 },
  { month: 'Mar', users: 5800 },
  { month: 'Apr', users: 6400 },
  { month: 'May', users: 7200 },
  { month: 'Jun', users: 8540 },
];

const pendingShops = [
  { id: 1, name: 'Green Valley Organics', owner: 'Rahul Sharma', date: '2026-01-21', status: 'pending' },
  { id: 2, name: 'Fresh Farm Mart', owner: 'Priya Patel', date: '2026-01-20', status: 'pending' },
];

const auditLogs = [
  { id: 1, action: 'User Login', user: 'admin@grocerai.com', time: '2 min ago', type: 'auth' },
  { id: 2, action: 'Shop Approved', user: 'admin@grocerai.com', time: '15 min ago', type: 'approval' },
  { id: 3, action: 'Product Updated', user: 'store@example.com', time: '1 hour ago', type: 'update' },
  { id: 4, action: 'Order Flagged', user: 'system', time: '2 hours ago', type: 'alert' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'shops', label: 'Shops', icon: Store },
    { id: 'fraud', label: 'Fraud Detection', icon: Shield },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
  ];

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${mockAnalytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: '+12.5%',
      color: 'text-primary',
    },
    {
      label: 'Active Users',
      value: mockAnalytics.activeUsers.toLocaleString(),
      icon: Users,
      trend: '+8.2%',
      color: 'text-chart-4',
    },
    {
      label: 'Avg Order Value',
      value: `₹${mockAnalytics.avgOrderValue}`,
      icon: ShoppingCart,
      trend: '+3.1%',
      color: 'text-chart-3',
    },
    {
      label: 'System Health',
      value: '99.9%',
      icon: Server,
      trend: 'Operational',
      color: 'text-primary',
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Menu */}
      <aside className="hidden lg:flex w-56 flex-col border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">Platform Control</p>
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
              {item.id === 'approvals' && pendingShops.length > 0 && (
                <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {pendingShops.length}
                </Badge>
              )}
              {item.id === 'fraud' && mockAnalytics.fraudAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {mockAnalytics.fraudAlerts.length}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Platform Analytics</h1>
            <p className="text-muted-foreground">Monitor platform health and business metrics</p>
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Search..." 
              className="w-64" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Performance Metrics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <Card key={i} className="card-elevated">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-xs text-primary flex items-center mb-1">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shop Approval Panel */}
        <Card className="card-elevated mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Pending Shop Approvals
              </span>
              <Badge variant="outline">{pendingShops.length} pending</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingShops.length > 0 ? (
              <div className="space-y-3">
                {pendingShops.map(shop => (
                  <div key={shop.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{shop.name}</p>
                        <p className="text-xs text-muted-foreground">Owner: {shop.owner} • Applied: {shop.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-destructive">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No pending approvals.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Sales Trends Chart */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockAnalytics.salesTrends}>
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

          {/* User Growth Chart */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.2)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Fraud Detection */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Fraud Detection Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockAnalytics.fraudAlerts.length > 0 ? (
                <div className="space-y-3">
                  {mockAnalytics.fraudAlerts.map((alert, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-destructive/10 border border-destructive/20"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">Potential Fraud Detected</span>
                            <Badge variant="destructive" className="text-xs">
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                        </div>
                        <Button size="sm" variant="destructive">
                          Investigate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No fraud alerts detected</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit Logs */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map(log => (
                  <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      log.type === 'alert' ? 'bg-destructive/10' : 
                      log.type === 'approval' ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      {log.type === 'auth' && <Users className="h-4 w-4" />}
                      {log.type === 'approval' && <CheckCircle className="h-4 w-4 text-primary" />}
                      {log.type === 'update' && <FileText className="h-4 w-4" />}
                      {log.type === 'alert' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
