import { useState } from 'react';
import { ShoppingListItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, Sparkles, TrendingUp, ShoppingCart, Lightbulb } from 'lucide-react';

const aiSuggestions = [
  { name: 'Eggs', reason: 'Frequently bought with milk', price: 85 },
  { name: 'Bread', reason: 'Running low based on purchase pattern', price: 45 },
  { name: 'Butter', reason: 'Complements your cart items', price: 120 },
];

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([
    { id: '1', name: 'Milk (1L)', estimatedPrice: 72, checked: false },
    { id: '2', name: 'Bananas (1 dozen)', estimatedPrice: 60, checked: true },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [budget, setBudget] = useState(500);

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

  const addSuggestion = (suggestion: typeof aiSuggestions[0]) => {
    const newItem: ShoppingListItem = {
      id: Date.now().toString(),
      name: suggestion.name,
      estimatedPrice: suggestion.price,
      checked: false,
    };
    setItems([...items, newItem]);
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
  const checkedCost = items.filter(i => i.checked).reduce((sum, item) => sum + item.estimatedPrice, 0);
  const budgetRemaining = budget - totalCost;
  const budgetUsedPercent = Math.min((totalCost / budget) * 100, 100);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Shopping List & Budget</h1>
          <p className="text-muted-foreground">Plan your purchases and track expenses smartly</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Budget Overview */}
            <Card className="card-elevated">
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Monthly Budget</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                      <Input
                        type="number"
                        value={budget || ''}
                        onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-warning">Total Estimated</label>
                    <p className="text-2xl font-bold mt-1">₹{totalCost.toFixed(0)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Remaining</label>
                    <p className={`text-2xl font-bold mt-1 ${budgetRemaining >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      ₹{budgetRemaining.toFixed(0)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Budget Used</span>
                    <span>{budgetUsedPercent.toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={budgetUsedPercent} 
                    className={budgetUsedPercent > 90 ? '[&>div]:bg-destructive' : ''}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Add Item Form */}
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Add New Item</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Item Name (e.g., Milk)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                  />
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                    <Input
                      type="number"
                      placeholder="Price"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="pl-7"
                      onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    />
                  </div>
                  <Button onClick={addItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Items List */}
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Your Items ({items.length})
                  </CardTitle>
                  <Badge variant="secondary">
                    ₹{checkedCost} purchased
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p>Your shopping list is empty.</p>
                      <p className="text-sm">Add items to start planning.</p>
                    </div>
                  ) : (
                    items.map(item => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          item.checked ? 'bg-primary/5' : 'bg-muted/30 hover:bg-muted/50'
                        }`}
                      >
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(item.id)}
                        />
                        <span className={`flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                          {item.name}
                        </span>
                        <span className="text-sm font-medium">₹{item.estimatedPrice.toFixed(0)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
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

          {/* AI Suggestions Sidebar */}
          <div className="space-y-6">
            <Card className="card-elevated border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Smart Suggestions
                </CardTitle>
                <CardDescription>AI-powered recommendations based on your habits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{suggestion.name}</span>
                        <span className="text-sm text-primary font-medium">₹{suggestion.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" />
                        {suggestion.reason}
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => addSuggestion(suggestion)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add to List
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Spending Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last month</span>
                    <span className="font-medium">₹4,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This month (so far)</span>
                    <span className="font-medium">₹2,180</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Avg. savings</span>
                    <span className="font-medium text-primary">12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
