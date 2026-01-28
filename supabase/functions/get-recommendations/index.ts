import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Purchase {
  product_id: string;
  product_name: string;
  category: string;
  quantity: number;
  purchased_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  unit: string;
  isVegan?: boolean;
  isVegetarian?: boolean;
  isOrganic?: boolean;
}

// Product catalog
const productsCatalog: Product[] = [
  { id: '1', name: 'Organic Bananas (1 Dozen)', description: 'Sweet, perfectly ripe organic bananas.', price: 60, category: 'Produce', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop', stock: 150, unit: 'dozen', isVegan: true, isOrganic: true },
  { id: '2', name: 'Fresh Avocados (Pack of 2)', description: 'Creamy, nutrient-dense avocados.', price: 240, category: 'Produce', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=200&fit=crop', stock: 40, unit: 'pack', isVegan: true },
  { id: '3', name: 'Red Strawberries (Box)', description: 'Juicy, sweet red strawberries.', price: 250, originalPrice: 299, category: 'Produce', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=200&fit=crop', stock: 30, unit: 'box', isVegan: true },
  { id: '4', name: 'Organic Baby Spinach', description: 'Fresh, tender baby spinach leaves.', price: 80, category: 'Produce', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=200&fit=crop', stock: 60, unit: 'bag', isVegan: true, isVegetarian: true, isOrganic: true },
  { id: '5', name: 'Crisp Carrots (1kg)', description: 'Crunchy, sweet organic carrots.', price: 60, category: 'Produce', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=200&fit=crop', stock: 80, unit: 'kg', isVegan: true, isVegetarian: true },
  { id: '6', name: 'Whole Milk (1L)', description: 'Fresh, pasteurized whole milk.', price: 72, category: 'Dairy', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop', stock: 40, unit: 'liter', isVegetarian: true },
  { id: '7', name: 'Almond Milk (Unsweetened)', description: 'Smooth, nutty almond milk.', price: 299, category: 'Dairy', image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=300&h=200&fit=crop', stock: 25, unit: 'liter', isVegan: true },
  { id: '8', name: 'Greek Yogurt (400g)', description: 'Creamy, protein-rich Greek yogurt.', price: 250, category: 'Dairy', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop', stock: 35, unit: 'tub', isVegetarian: true },
  { id: '9', name: 'Farm Fresh Eggs (Pack of 6)', description: 'Free-range eggs from happy hens.', price: 85, category: 'Dairy', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=200&fit=crop', stock: 50, unit: 'pack', isVegetarian: true },
  { id: '10', name: 'Cheddar Cheese Block', description: 'Aged cheddar with rich, sharp flavor.', price: 340, category: 'Dairy', image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=300&h=200&fit=crop', stock: 30, unit: 'block', isVegetarian: true },
  { id: '11', name: 'Sourdough Bread Loaf', description: 'Artisan sourdough with crispy crust.', price: 120, category: 'Bakery', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300&h=200&fit=crop', stock: 20, unit: 'loaf', isVegan: true },
  { id: '12', name: 'Croissants (Pack of 4)', description: 'Buttery, flaky French croissants.', price: 180, category: 'Bakery', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=200&fit=crop', stock: 15, unit: 'pack', isVegetarian: true },
];

// Association rules: products frequently bought together
const associationRules: Record<string, { relatedProducts: string[]; confidence: number }> = {
  '6': { relatedProducts: ['11', '9', '12'], confidence: 0.85 }, // Milk → Bread, Eggs, Croissants
  '11': { relatedProducts: ['6', '10', '8'], confidence: 0.80 }, // Bread → Milk, Cheese, Yogurt
  '9': { relatedProducts: ['6', '11', '10'], confidence: 0.75 }, // Eggs → Milk, Bread, Cheese
  '1': { relatedProducts: ['8', '7', '3'], confidence: 0.70 }, // Bananas → Yogurt, Almond Milk, Strawberries
  '8': { relatedProducts: ['1', '3', '7'], confidence: 0.72 }, // Yogurt → Bananas, Strawberries, Almond Milk
  '4': { relatedProducts: ['2', '5', '9'], confidence: 0.68 }, // Spinach → Avocados, Carrots, Eggs
  '2': { relatedProducts: ['4', '9', '11'], confidence: 0.65 }, // Avocados → Spinach, Eggs, Bread
  '10': { relatedProducts: ['11', '9', '6'], confidence: 0.78 }, // Cheese → Bread, Eggs, Milk
};

// Calculate recency weight (exponential decay)
function calculateRecencyWeight(purchaseDate: string): number {
  const now = new Date();
  const purchase = new Date(purchaseDate);
  const daysSincePurchase = (now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24);
  // Exponential decay: recent purchases weighted higher
  return Math.exp(-daysSincePurchase / 30); // 30-day half-life
}

// Analyze purchase patterns
function analyzePurchasePatterns(purchases: Purchase[]) {
  const productFrequency: Record<string, { count: number; totalQty: number; recencyScore: number; lastPurchase: string; name: string; category: string }> = {};
  const categoryFrequency: Record<string, number> = {};

  for (const purchase of purchases) {
    const { product_id, product_name, category, quantity, purchased_at } = purchase;
    const recencyWeight = calculateRecencyWeight(purchased_at);

    if (!productFrequency[product_id]) {
      productFrequency[product_id] = { count: 0, totalQty: 0, recencyScore: 0, lastPurchase: purchased_at, name: product_name, category };
    }
    productFrequency[product_id].count += 1;
    productFrequency[product_id].totalQty += quantity || 1;
    productFrequency[product_id].recencyScore += recencyWeight;
    if (new Date(purchased_at) > new Date(productFrequency[product_id].lastPurchase)) {
      productFrequency[product_id].lastPurchase = purchased_at;
    }

    categoryFrequency[category] = (categoryFrequency[category] || 0) + 1;
  }

  return { productFrequency, categoryFrequency };
}

// Find complementary products using association rules
function findComplementaryProducts(purchasedProductIds: Set<string>): { productId: string; confidence: number; sourceProduct: string }[] {
  const complementary: { productId: string; confidence: number; sourceProduct: string }[] = [];
  
  for (const productId of purchasedProductIds) {
    const rules = associationRules[productId];
    if (rules) {
      for (const relatedId of rules.relatedProducts) {
        if (!purchasedProductIds.has(relatedId)) {
          complementary.push({
            productId: relatedId,
            confidence: rules.confidence,
            sourceProduct: productId,
          });
        }
      }
    }
  }

  // Deduplicate and take highest confidence
  const seen = new Map<string, { productId: string; confidence: number; sourceProduct: string }>();
  for (const item of complementary) {
    if (!seen.has(item.productId) || seen.get(item.productId)!.confidence < item.confidence) {
      seen.set(item.productId, item);
    }
  }

  return Array.from(seen.values()).sort((a, b) => b.confidence - a.confidence);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    });

    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getUser(token);
      userId = data?.user?.id || null;
    }

    // Fetch user purchase history with timestamps
    let purchases: Purchase[] = [];
    if (userId) {
      const { data } = await supabase
        .from("user_purchases")
        .select("product_id, product_name, category, quantity, purchased_at")
        .eq("user_id", userId)
        .order("purchased_at", { ascending: false })
        .limit(100);
      purchases = data || [];
    }

    // Fetch popular products for cold start
    const { data: popularProducts } = await supabase
      .from("popular_products")
      .select("product_id, popularity_score")
      .order("popularity_score", { ascending: false })
      .limit(10);

    const hasOrderHistory = purchases.length > 0;

    if (!hasOrderHistory) {
      // Cold start: return popular products
      console.log("No order history, using popularity-based recommendations");
      const fallbackRecommendations = productsCatalog.slice(0, 6).map((p, idx) => ({
        product: p,
        confidence_score: 0.8 - (idx * 0.05),
        reasoning: "Popular among our customers - great for first-time shoppers!",
        recommendation_type: "popularity" as const,
      }));

      return new Response(JSON.stringify({ 
        recommendations: fallbackRecommendations, 
        source: "cold_start",
        analysis: { message: "Start shopping to get personalized recommendations!" }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Analyze purchase patterns
    const { productFrequency, categoryFrequency } = analyzePurchasePatterns(purchases);
    const purchasedProductIds = new Set(purchases.map(p => p.product_id));

    // Find frequently purchased products (for replenishment)
    const frequentProducts = Object.entries(productFrequency)
      .map(([id, data]) => ({
        id,
        ...data,
        // Combined score: frequency + recency + quantity
        score: (data.count * 0.4) + (data.recencyScore * 0.4) + (Math.min(data.totalQty, 10) / 10 * 0.2),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    // Find complementary products using association rules
    const complementaryProducts = findComplementaryProducts(purchasedProductIds);

    // Top categories
    const topCategories = Object.entries(categoryFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);

    // Build AI prompt with rich purchase analysis
    const systemPrompt = `You are an AI grocery recommendation engine analyzing ORDER HISTORY to provide personalized recommendations.

RECOMMENDATION STRATEGIES (use all):

1. **REPLENISHMENT (40%)**: Products the user buys frequently and may need to reorder
   - Look at purchase frequency and recency
   - Suggest items they buy regularly

2. **ASSOCIATION RULES (30%)**: Complementary products often bought together
   - If user buys milk → suggest bread, eggs, cereal
   - Use the provided association data

3. **CATEGORY AFFINITY (20%)**: Products from their favorite categories
   - Recommend new products from categories they shop often

4. **TRENDING (10%)**: Popular items they haven't tried

EXPLAINABILITY REQUIREMENTS - Use specific reasons like:
- "You've ordered this 5 times in the last month"
- "Usually bought with [product] which you purchase often"
- "Popular in ${topCategories[0]} - your favorite category"
- "Customers who buy [product] often get this too"`;

    const userPrompt = `PURCHASE FREQUENCY ANALYSIS:
${frequentProducts.map(p => `- ${p.name}: Ordered ${p.count}x, Total qty: ${p.totalQty}, Last: ${new Date(p.lastPurchase).toLocaleDateString()}`).join('\n')}

TOP CATEGORIES: ${topCategories.join(', ')}

ASSOCIATION RULE SUGGESTIONS (products often bought together):
${complementaryProducts.slice(0, 5).map(c => {
  const sourceProduct = productsCatalog.find(p => p.id === c.sourceProduct);
  const targetProduct = productsCatalog.find(p => p.id === c.productId);
  return `- ${targetProduct?.name} (often bought with ${sourceProduct?.name}, confidence: ${(c.confidence * 100).toFixed(0)}%)`;
}).join('\n')}

PRODUCT CATALOG:
${JSON.stringify(productsCatalog.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price })))}

Recommend 6 products with detailed, personalized explanations referencing their specific purchase history.`;

    if (!lovableApiKey) {
      // Fallback without AI
      type RecType = 'collaborative' | 'content_based' | 'popularity' | 'trending' | 'replenishment' | 'association' | 'category';
      const recommendations: { product: Product; confidence_score: number; reasoning: string; recommendation_type: RecType }[] = [];
      
      for (const fp of frequentProducts.slice(0, 6)) {
        const product = productsCatalog.find(p => p.id === fp.id);
        if (product) {
          recommendations.push({
            product,
            confidence_score: Math.min(0.95, 0.7 + (fp.score * 0.1)),
            reasoning: `You've ordered this ${fp.count} time${fp.count > 1 ? 's' : ''} - time to restock?`,
            recommendation_type: "replenishment",
          });
        }
      }

      // Add complementary products if needed
      while (recommendations.length < 6 && complementaryProducts.length > 0) {
        const comp = complementaryProducts.shift();
        if (comp) {
          const product = productsCatalog.find(p => p.id === comp.productId);
          const sourceProduct = productsCatalog.find(p => p.id === comp.sourceProduct);
          if (product) {
            recommendations.push({
              product,
              confidence_score: comp.confidence,
              reasoning: `Often bought with ${sourceProduct?.name} which you purchase regularly`,
              recommendation_type: "association",
            });
          }
        }
      }

      return new Response(JSON.stringify({ 
        recommendations, 
        source: "personalized",
        analysis: { frequentProducts: frequentProducts.length, topCategories }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call AI for intelligent recommendations
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_recommendations",
              description: "Return personalized product recommendations based on order history",
              parameters: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        product_id: { type: "string" },
                        confidence_score: { type: "number" },
                        reasoning: { type: "string", description: "Specific, personalized explanation referencing their purchase history" },
                        recommendation_type: { type: "string", enum: ["replenishment", "association", "category", "trending"] },
                      },
                      required: ["product_id", "confidence_score", "reasoning", "recommendation_type"],
                    },
                  },
                },
                required: ["recommendations"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_recommendations" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      throw new Error("Invalid AI response format");
    }

    const aiRecommendations = JSON.parse(toolCall.function.arguments);

    // Map to full product data
    const recommendations = aiRecommendations.recommendations
      .map((rec: { product_id: string; confidence_score: number; reasoning: string; recommendation_type: string }) => {
        const product = productsCatalog.find(p => p.id === rec.product_id);
        if (!product) return null;
        return {
          product,
          confidence_score: rec.confidence_score,
          reasoning: rec.reasoning,
          recommendation_type: rec.recommendation_type,
        };
      })
      .filter(Boolean)
      .slice(0, 6);

    // Supplement if needed
    if (recommendations.length < 6) {
      const existingIds = new Set(recommendations.map((r: { product: Product }) => r.product.id));
      for (const fp of frequentProducts) {
        if (recommendations.length >= 6) break;
        if (!existingIds.has(fp.id)) {
          const product = productsCatalog.find(p => p.id === fp.id);
          if (product) {
            recommendations.push({
              product,
              confidence_score: 0.7,
              reasoning: `You've ordered this ${fp.count} times - might need a refill!`,
              recommendation_type: "replenishment",
            });
            existingIds.add(fp.id);
          }
        }
      }
    }

    return new Response(JSON.stringify({
      recommendations,
      source: "personalized",
      user_id: userId,
      analysis: { 
        totalOrders: purchases.length,
        frequentProducts: frequentProducts.length,
        topCategories,
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
