import { useState, useMemo } from 'react';
import { products, categories } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { CartSheet } from '@/components/shop/CartSheet';
import { AIAssistant } from '@/components/shop/AIAssistant';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Camera } from 'lucide-react';

export default function Shop() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold">Fresh Market</h1>
            <p className="text-sm text-muted-foreground">Find the best organic produce near you</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
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
            <CartSheet />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map(category => (
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
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your search.</p>
          </div>
        )}
      </div>

      <AIAssistant />
    </div>
  );
}
