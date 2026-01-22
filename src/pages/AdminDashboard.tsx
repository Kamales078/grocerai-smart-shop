import { mockAnalytics } from '@/data/orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Users, ShoppingCart, AlertTriangle, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
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
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground">Monitor platform health and business metrics</p>
      </div>

      {/* Pending Approvals */}
      <Card className="card-elevated mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Pending Shop Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No pending approvals.</p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
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

      <div className="grid lg:grid-cols-2 gap-6">
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

        {/* Fraud Detection */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Fraud Detection</CardTitle>
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
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No fraud alerts detected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
