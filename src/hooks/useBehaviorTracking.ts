import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

type TrackingAction = 'view' | 'add_to_cart' | 'remove_from_cart' | 'purchase' | 'rate';

export function useBehaviorTracking() {
  const trackBehavior = useCallback(async (
    action: TrackingAction,
    product: Product,
    additionalData?: { quantity?: number; rating?: number }
  ) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.access_token) {
        // User not logged in, skip tracking
        return;
      }

      await supabase.functions.invoke('track-behavior', {
        body: {
          action,
          product_id: product.id,
          product_name: product.name,
          category: product.category,
          price: product.price,
          ...additionalData,
        },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });
    } catch (err) {
      // Silently fail tracking - don't impact user experience
      console.warn('Behavior tracking failed:', err);
    }
  }, []);

  const trackView = useCallback((product: Product) => {
    trackBehavior('view', product);
  }, [trackBehavior]);

  const trackAddToCart = useCallback((product: Product, quantity = 1) => {
    trackBehavior('add_to_cart', product, { quantity });
  }, [trackBehavior]);

  const trackRemoveFromCart = useCallback((product: Product, quantity = 1) => {
    trackBehavior('remove_from_cart', product, { quantity });
  }, [trackBehavior]);

  const trackPurchase = useCallback((product: Product, quantity = 1) => {
    trackBehavior('purchase', product, { quantity });
  }, [trackBehavior]);

  const trackRating = useCallback((product: Product, rating: number) => {
    trackBehavior('rate', product, { rating });
  }, [trackBehavior]);

  return {
    trackView,
    trackAddToCart,
    trackRemoveFromCart,
    trackPurchase,
    trackRating,
  };
}
