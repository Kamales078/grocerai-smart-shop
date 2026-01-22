import { useState } from 'react';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, AlertTriangle } from 'lucide-react';

export default function StoreDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">KR MARKET</h1>
          <p className="text-muted-foreground">Manage your store inventory and offers</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="card-elevated overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Current Inventory ({products.length})</h3>
          <Input placeholder="Search products..." className="max-w-xs" />
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
            {products.map(product => (
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
                    <Badge className="bg-warning text-warning-foreground">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 card-elevated border-l-4 border-l-warning">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium">AI Demand Forecast</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Based on seasonal trends, consider stocking up on Strawberries (+40% demand expected) 
              and Croissants (+25%) for the upcoming weekend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
