import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Store, Truck, Shield, Leaf, ArrowRight } from 'lucide-react';

const roleConfig: Record<UserRole, { icon: typeof ShoppingCart; title: string; subtitle: string }> = {
  customer: {
    icon: ShoppingCart,
    title: 'Fresh Groceries,',
    subtitle: 'Delivered Smartly.',
  },
  store_owner: {
    icon: Store,
    title: 'Manage Your Store',
    subtitle: 'With AI Insights.',
  },
  delivery: {
    icon: Truck,
    title: 'Optimize Routes,',
    subtitle: 'Maximize Earnings.',
  },
  admin: {
    icon: Shield,
    title: 'Control The Platform',
    subtitle: 'At Scale.',
  },
};

export default function Login() {
  const [role, setRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, role);
      navigate('/shop');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient p-12 flex-col justify-between text-sidebar-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold">GrocerAI</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
            {config.title}
            <br />
            <span className="text-primary-foreground/80">{config.subtitle}</span>
          </h1>
          <p className="text-lg text-sidebar-foreground/70 max-w-md">
            {role === 'customer' && 'Experience AI-powered shopping with visual search and personalized recipes.'}
            {role === 'store_owner' && 'Predict demand, prevent stockouts, and generate marketing insights instantly.'}
            {role === 'delivery' && 'Real-time traffic analysis and smart routing to get you to customers faster.'}
            {role === 'admin' && 'Monitor platform health, detect fraud, and analyze global sales trends in one place.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-sidebar-foreground/60">
          <Icon className="h-5 w-5" />
          <span>Your Intelligent Grocery Partner</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">GrocerAI</span>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-muted-foreground">Enter your details to access your account</p>
          </div>

          <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1">
              <TabsTrigger value="customer" className="flex flex-col gap-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs">Customer</span>
              </TabsTrigger>
              <TabsTrigger value="store_owner" className="flex flex-col gap-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Store className="h-4 w-4" />
                <span className="text-xs">Store Owner</span>
              </TabsTrigger>
              <TabsTrigger value="delivery" className="flex flex-col gap-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Truck className="h-4 w-4" />
                <span className="text-xs">Delivery</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex flex-col gap-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Shield className="h-4 w-4" />
                <span className="text-xs">Admin</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" size="lg">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="#" className="text-primary font-medium hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
