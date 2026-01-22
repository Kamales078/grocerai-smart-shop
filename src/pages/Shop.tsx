import { useState, useMemo } from 'react';
import { products, categories } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { CartSheet } from '@/components/shop/CartSheet';
import { AIAssistant } from '@/components/shop/AIAssistant';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Sparkles, 
  Camera, 
  Apple, 
  Milk, 
  Croissant, 
  Beef, 
  Package,
  Tag,
  ChevronRight,
  User,
  Bell
} from 'lucide-react';

const categoryIcons: Record<string, typeof Apple> = {
  'Produce': Apple,
  'Dairy': Milk,
  'Bakery': Croissant,
  'Meat': Beef,
  'Pantry': Package,
};

export default function Shop() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useAuth();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || 
        product.category === selectedCategory ||
        (selectedCategory === 'Special Offers' && product.originalPrice) ||
        (selectedCategory === 'Flash Deals' && product.originalPrice);
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const sidebarCategories = ['Produce', 'Dairy', 'Bakery', 'Meat', 'Pantry'];

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar - Categories */}
      <aside className="hidden lg:flex w-56 flex-col border-r bg-card">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Categories</h3>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-foreground'
            }`}
          >
            <Package className="h-4 w-4" />
            All Products
            <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
          </button>
          {sidebarCategories.map(category => {
            const Icon = categoryIcons[category] || Package;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category}
                <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
              </button>
            );
          })}
        </nav>
        
        {/* Quick Offers Section */}
        <div className="p-3 border-t">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Today's Deals</span>
            </div>
            <p className="text-xs text-muted-foreground">Up to 30% off on fresh produce!</p>
            <Button size="sm" variant="link" className="p-0 h-auto text-xs text-primary mt-1">
              View All Offers →
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-xl font-bold">Fresh Market</h1>
              <p className="text-sm text-muted-foreground">Find the best organic produce near you</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for apples, milk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-10"
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Offers Badge */}
              <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                <Sparkles className="h-4 w-4 text-warning" />
                Offers
              </Button>
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  2
                </span>
              </Button>
              
              {/* Profile */}
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              {/* Cart */}
              <CartSheet />
            </div>
          </div>

          {/* Category Pills (Mobile) */}
          <div className="lg:hidden px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.slice(0, 6).map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`cursor-pointer shrink-0 transition-colors ${
                  selectedCategory === category ? '' : 'hover:bg-muted'
                } ${category === 'Flash Deals' ? 'border-warning text-warning' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'Special Offers' && <Sparkles className="h-3 w-3 mr-1" />}
                {category}
              </Badge>
            ))}
          </div>
        </header>

        {/* Product Grid */}
        <div className="flex-1 p-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} items available
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Price: Low to High</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Newest</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      <AIAssistant />
    </div>
  );
}
