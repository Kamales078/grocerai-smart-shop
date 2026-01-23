import { useRecommendations, Recommendation } from '@/hooks/useRecommendations';
import { ProductCard } from '@/components/ui/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target, 
  RefreshCw,
  Info,
  ChevronRight
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const typeIcons: Record<string, typeof Sparkles> = {
  collaborative: Users,
  content_based: Target,
  popularity: TrendingUp,
  trending: Sparkles,
};

const typeLabels: Record<string, string> = {
  collaborative: 'Similar shoppers bought',
  content_based: 'Based on your preferences',
  popularity: 'Popular choice',
  trending: 'Trending now',
};

export function RecommendedProducts() {
  const { recommendations, isLoading, error, source, refetch } = useRecommendations();

  if (error) {
    return (
      <div className="p-6 bg-card rounded-xl border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Recommended for You</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Recommended for You</h2>
            <p className="text-sm text-muted-foreground">
              {source === 'personalized' 
                ? 'AI-powered picks based on your shopping habits'
                : 'Discover our most popular products'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Our AI analyzes your browsing history, cart activity, and purchases 
                  to recommend products you'll love. The more you shop, the smarter it gets!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="ghost" size="sm" onClick={refetch} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Recommendations Grid */}
      {!isLoading && recommendations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {recommendations.map((rec, index) => (
            <RecommendationCard key={rec.product.id} recommendation={rec} rank={index + 1} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && recommendations.length === 0 && (
        <div className="text-center py-8 bg-muted/30 rounded-xl border border-dashed">
          <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            Start shopping to get personalized recommendations!
          </p>
        </div>
      )}

      {/* View All */}
      {!isLoading && recommendations.length > 0 && (
        <div className="text-center pt-2">
          <Button variant="link" className="text-primary">
            View All Recommendations
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  rank: number;
}

function RecommendationCard({ recommendation, rank }: RecommendationCardProps) {
  const { product, confidence_score, reasoning, recommendation_type } = recommendation;
  const Icon = typeIcons[recommendation_type] || Sparkles;
  const label = typeLabels[recommendation_type] || 'Recommended';

  return (
    <div className="relative group">
      {/* Confidence Badge */}
      {rank <= 3 && (
        <div className="absolute -top-2 -left-2 z-10">
          <Badge 
            variant="default" 
            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg"
          >
            #{rank} Pick
          </Badge>
        </div>
      )}

      {/* Product Card */}
      <ProductCard product={product} />

      {/* Explainable AI Footer */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-2 p-2 bg-muted/50 rounded-lg cursor-help transition-colors hover:bg-muted">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span className="line-clamp-1">{label}</span>
                <div className="ml-auto flex items-center gap-1">
                  <div 
                    className="h-1.5 w-12 bg-muted rounded-full overflow-hidden"
                    title={`${Math.round(confidence_score * 100)}% match`}
                  >
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                      style={{ width: `${confidence_score * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium">
                    {Math.round(confidence_score * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-sm font-medium mb-1">Why we recommend this:</p>
            <p className="text-xs text-muted-foreground">{reasoning}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
