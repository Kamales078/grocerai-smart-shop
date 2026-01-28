import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export interface Recommendation {
  product: Product;
  confidence_score: number;
  reasoning: string;
  recommendation_type: 'collaborative' | 'content_based' | 'popularity' | 'trending' | 'replenishment' | 'association' | 'category';
}

interface AnalysisData {
  totalOrders?: number;
  frequentProducts?: number;
  topCategories?: string[];
  message?: string;
}

interface RecommendationsResponse {
  recommendations: Recommendation[];
  source: 'personalized' | 'cold_start' | 'fallback';
  user_id?: string;
  analysis?: AnalysisData;
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const { user } = useAuth();

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke<RecommendationsResponse>('get-recommendations', {
        headers: session?.session?.access_token 
          ? { Authorization: `Bearer ${session.session.access_token}` }
          : {},
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch recommendations');
      }

      if (response.data) {
        setRecommendations(response.data.recommendations || []);
        setSource(response.data.source || 'unknown');
        setAnalysis(response.data.analysis || null);
      }
    } catch (err) {
      console.error('Recommendations error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations, user]);

  return {
    recommendations,
    isLoading,
    error,
    source,
    analysis,
    refetch: fetchRecommendations,
  };
}
