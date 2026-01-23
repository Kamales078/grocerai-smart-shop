-- Create tables for tracking user behavior and recommendations

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User browsing history
CREATE TABLE public.user_browsing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  view_count INTEGER DEFAULT 1,
  last_viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_browsing_history ENABLE ROW LEVEL SECURITY;

-- Browsing history policies
CREATE POLICY "Users can view their own browsing history" ON public.user_browsing_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own browsing history" ON public.user_browsing_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own browsing history" ON public.user_browsing_history FOR UPDATE USING (auth.uid() = user_id);

-- User cart history (for collaborative filtering)
CREATE TABLE public.user_cart_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  action TEXT NOT NULL CHECK (action IN ('added', 'removed', 'purchased')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_cart_history ENABLE ROW LEVEL SECURITY;

-- Cart history policies
CREATE POLICY "Users can view their own cart history" ON public.user_cart_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cart history" ON public.user_cart_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User purchases for recommendations
CREATE TABLE public.user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- Purchases policies
CREATE POLICY "Users can view their own purchases" ON public.user_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own purchases" ON public.user_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Product ratings for collaborative filtering
CREATE TABLE public.product_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.product_ratings ENABLE ROW LEVEL SECURITY;

-- Ratings policies
CREATE POLICY "Users can view all ratings" ON public.product_ratings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own ratings" ON public.product_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ratings" ON public.product_ratings FOR UPDATE USING (auth.uid() = user_id);

-- Popular products cache (updated periodically)
CREATE TABLE public.popular_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL UNIQUE,
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  cart_add_count INTEGER DEFAULT 0,
  popularity_score DECIMAL(10, 4) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read for popularity-based recommendations)
ALTER TABLE public.popular_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view popular products" ON public.popular_products FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_browsing_user_id ON public.user_browsing_history(user_id);
CREATE INDEX idx_browsing_product_id ON public.user_browsing_history(product_id);
CREATE INDEX idx_cart_user_id ON public.user_cart_history(user_id);
CREATE INDEX idx_purchases_user_id ON public.user_purchases(user_id);
CREATE INDEX idx_purchases_category ON public.user_purchases(category);
CREATE INDEX idx_ratings_user_id ON public.product_ratings(user_id);
CREATE INDEX idx_ratings_product_id ON public.product_ratings(product_id);
CREATE INDEX idx_popular_score ON public.popular_products(popularity_score DESC);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_popular_products_updated_at
  BEFORE UPDATE ON public.popular_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();