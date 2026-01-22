import { useState } from 'react';
import { ShoppingListItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [budget, setBudget] = useState(0);

  const addItem = () => {
    if (!newItemName.trim()) return;
    const newItem: ShoppingListItem = {
      id: Date.now().toString(),
      name: newItemName,
      estimatedPrice: parseFloat(newItemPrice) || 0,
      checked: false,
    };
    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalCost = items.reduce((sum, item) => sum + item.estimatedPrice, 0);
  const budgetRemaining = budget - totalCost;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Shopping List & Budget</CardTitle>
          <CardDescription>Plan your monthly purchases and track expenses.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Monthly Budget Limit</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  type="number"
                  value={budget || ''}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-warning">Total Estimated Cost</label>
              <p className="text-2xl font-bold">₹{totalCost.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Budget</label>
              <p className={`text-2xl font-bold ${budgetRemaining >= 0 ? 'text-primary' : 'text-destructive'}`}>
                ₹{budgetRemaining.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Add Item Form */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <h4 className="font-medium">Add New Item</h4>
            <div className="flex gap-3">
              <Input
                placeholder="Item Name (e.g., Milk)"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1"
              />
              <div className="relative w-32">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  type="number"
                  placeholder="Est. Price"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
            <Button onClick={addItem} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Your shopping list is empty.</p>
                <p className="text-sm">Add items to start planning.</p>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <span className={`flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                    {item.name}
                  </span>
                  <span className="text-sm font-medium">₹{item.estimatedPrice.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
