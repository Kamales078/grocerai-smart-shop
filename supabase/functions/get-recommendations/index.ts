import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserBehavior {
  browsingHistory: { product_id: string; product_name: string; category: string; view_count: number }[];
  cartHistory: { product_id: string; product_name: string; category: string; action: string }[];
  purchases: { product_id: string; product_name: string; category: string; quantity: number }[];
  ratings: { product_id: string; rating: number }[];
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

// Sample products catalog (in production, this would come from a database)
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

    // Get user ID from auth if available
    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getUser(token);
      userId = data?.user?.id || null;
    }

    // Fetch user behavior data
    let userBehavior: UserBehavior = {
      browsingHistory: [],
      cartHistory: [],
      purchases: [],
      ratings: [],
    };

    if (userId) {
      const [browsingRes, cartRes, purchasesRes, ratingsRes] = await Promise.all([
        supabase.from("user_browsing_history").select("product_id, product_name, category, view_count").eq("user_id", userId).order("last_viewed_at", { ascending: false }).limit(20),
        supabase.from("user_cart_history").select("product_id, product_name, category, action").eq("user_id", userId).order("created_at", { ascending: false }).limit(30),
        supabase.from("user_purchases").select("product_id, product_name, category, quantity").eq("user_id", userId).order("purchased_at", { ascending: false }).limit(50),
        supabase.from("product_ratings").select("product_id, rating").eq("user_id", userId),
      ]);

      userBehavior = {
        browsingHistory: browsingRes.data || [],
        cartHistory: cartRes.data || [],
        purchases: purchasesRes.data || [],
        ratings: ratingsRes.data || [],
      };
    }

    // Fetch popular products for cold start
    const { data: popularProducts } = await supabase
      .from("popular_products")
      .select("product_id, popularity_score")
      .order("popularity_score", { ascending: false })
      .limit(10);

    // Build recommendation prompt for AI
    const hasUserData = userBehavior.browsingHistory.length > 0 || 
                        userBehavior.cartHistory.length > 0 || 
                        userBehavior.purchases.length > 0;

    const systemPrompt = `You are an AI grocery recommendation engine. Analyze user behavior and product catalog to provide personalized recommendations.

Your task is to recommend 6 products using a hybrid approach:
1. COLLABORATIVE FILTERING: Products liked by similar users based on browsing/purchase patterns
2. CONTENT-BASED FILTERING: Products similar to what the user has shown interest in (same category, price range, attributes)
3. POPULARITY-BASED: For new users or as supplementary recommendations

For each recommendation, provide:
- product_id: The exact ID from the catalog
- confidence_score: 0.0 to 1.0 indicating match strength
- reasoning: Brief explanation of WHY this product is recommended (for Explainable AI)
- recommendation_type: "collaborative" | "content_based" | "popularity" | "trending"`;

    const userPrompt = hasUserData
      ? `User Behavior Analysis:
- Recently Viewed: ${JSON.stringify(userBehavior.browsingHistory.slice(0, 10))}
- Cart Activity: ${JSON.stringify(userBehavior.cartHistory.slice(0, 10))}
- Past Purchases: ${JSON.stringify(userBehavior.purchases.slice(0, 10))}
- Product Ratings: ${JSON.stringify(userBehavior.ratings)}

Product Catalog:
${JSON.stringify(productsCatalog.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price, isVegan: p.isVegan, isOrganic: p.isOrganic })))}

Popular Products: ${JSON.stringify(popularProducts || [])}

Based on this user's behavior, recommend 6 personalized products. Prioritize:
1. Products in categories they frequently browse/purchase
2. Products with attributes they prefer (organic, vegan, etc.)
3. Complementary products to their purchases
4. Trending items in their preferred categories`
      : `New User - Cold Start Scenario

Product Catalog:
${JSON.stringify(productsCatalog.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price, isVegan: p.isVegan, isOrganic: p.isOrganic })))}

Popular Products: ${JSON.stringify(popularProducts || [])}

For this new user with no history, recommend 6 products based on:
1. Overall popularity trends
2. High-value/quality products across categories
3. Seasonal or promotional items
4. Diverse category representation`;

    if (!lovableApiKey) {
      // Fallback: Return popularity-based recommendations without AI
      console.log("No LOVABLE_API_KEY, using fallback recommendations");
      const fallbackRecommendations = productsCatalog.slice(0, 6).map((p, idx) => ({
        product: p,
        confidence_score: 0.8 - (idx * 0.05),
        reasoning: "Popular product in our store",
        recommendation_type: "popularity" as const,
      }));

      return new Response(JSON.stringify({ recommendations: fallbackRecommendations, source: "fallback" }), {
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
              description: "Return personalized product recommendations",
              parameters: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        product_id: { type: "string", description: "Product ID from catalog" },
                        confidence_score: { type: "number", description: "Confidence 0.0-1.0" },
                        reasoning: { type: "string", description: "Why this product is recommended" },
                        recommendation_type: { type: "string", enum: ["collaborative", "content_based", "popularity", "trending"] },
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
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
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

    // Map AI recommendations to full product data
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

    // If AI didn't return enough, supplement with popular products
    if (recommendations.length < 6) {
      const existingIds = new Set(recommendations.map((r: { product: Product }) => r.product.id));
      const supplementary = productsCatalog
        .filter(p => !existingIds.has(p.id))
        .slice(0, 6 - recommendations.length)
        .map(p => ({
          product: p,
          confidence_score: 0.6,
          reasoning: "Popular choice among our customers",
          recommendation_type: "popularity",
        }));
      recommendations.push(...supplementary);
    }

    return new Response(JSON.stringify({
      recommendations,
      source: hasUserData ? "personalized" : "cold_start",
      user_id: userId,
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
