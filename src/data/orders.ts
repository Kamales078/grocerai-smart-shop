import { Order, AnalyticsData } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 'ORD-8821',
    customerId: '1',
    customerName: 'Alex User',
    items: [],
    total: 252,
    status: 'out_for_delivery',
    createdAt: '2026-01-22T14:15:00',
    address: '123 Innovation Dr, Tech City',
    deliveryPersonId: '3',
  },
  {
    id: 'ORD-8820',
    customerId: '2',
    customerName: 'Jane Smith',
    items: [],
    total: 450,
    status: 'preparing',
    createdAt: '2026-01-22T13:30:00',
    address: '456 Market St, Downtown',
  },
  {
    id: 'ORD-8819',
    customerId: '3',
    customerName: 'Mike Johnson',
    items: [],
    total: 180,
    status: 'delivered',
    createdAt: '2026-01-22T11:00:00',
    address: '789 Oak Ave, Suburb',
    deliveryPersonId: '3',
  },
];

export const mockAnalytics: AnalyticsData = {
  totalRevenue: 124592,
  activeUsers: 8540,
  avgOrderValue: 450,
  salesTrends: [
    { day: 'Mon', sales: 1800 },
    { day: 'Tue', sales: 2200 },
    { day: 'Wed', sales: 2800 },
    { day: 'Thu', sales: 2400 },
    { day: 'Fri', sales: 3800 },
    { day: 'Sat', sales: 3200 },
    { day: 'Sun', sales: 2000 },
  ],
  fraudAlerts: [
    {
      orderId: 'ORD-8821',
      message: 'Order #8821 shows unusual location patterns.',
      severity: 'high',
    },
  ],
};
