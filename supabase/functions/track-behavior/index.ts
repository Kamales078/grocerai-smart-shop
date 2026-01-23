import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    
    // User client for auth verification
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    });

    // Service role client for updating popular_products (bypasses RLS)
    const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify user
    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await userSupabase.auth.getUser(token);
      userId = data?.user?.id || null;
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, product_id, product_name, category, price, quantity } = await req.json();

    if (!action || !product_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (action) {
      case "view": {
        // Check if already viewed
        const { data: existing } = await userSupabase
          .from("user_browsing_history")
          .select("id, view_count")
          .eq("user_id", userId)
          .eq("product_id", product_id)
          .maybeSingle();

        if (existing) {
          // Update view count
          await userSupabase
            .from("user_browsing_history")
            .update({ 
              view_count: existing.view_count + 1, 
              last_viewed_at: new Date().toISOString() 
            })
            .eq("id", existing.id);
        } else {
          // Insert new record
          await userSupabase.from("user_browsing_history").insert({
            user_id: userId,
            product_id,
            product_name: product_name || "Unknown",
            category: category || "Unknown",
            view_count: 1,
          });
        }

        // Update popular products
        const { data: popProduct } = await adminSupabase
          .from("popular_products")
          .select("id, view_count")
          .eq("product_id", product_id)
          .maybeSingle();

        if (popProduct) {
          await adminSupabase
            .from("popular_products")
            .update({ 
              view_count: popProduct.view_count + 1,
              popularity_score: (popProduct.view_count + 1) * 1 + popProduct.view_count * 2,
            })
            .eq("id", popProduct.id);
        } else {
          await adminSupabase.from("popular_products").insert({
            product_id,
            view_count: 1,
            popularity_score: 1,
          });
        }
        break;
      }

      case "add_to_cart": {
        await userSupabase.from("user_cart_history").insert({
          user_id: userId,
          product_id,
          product_name: product_name || "Unknown",
          category: category || "Unknown",
          quantity: quantity || 1,
          action: "added",
        });

        // Update popular products cart count
        const { data: popProduct } = await adminSupabase
          .from("popular_products")
          .select("id, cart_add_count, view_count, purchase_count")
          .eq("product_id", product_id)
          .maybeSingle();

        if (popProduct) {
          const newCartCount = popProduct.cart_add_count + 1;
          await adminSupabase
            .from("popular_products")
            .update({ 
              cart_add_count: newCartCount,
              popularity_score: popProduct.view_count * 1 + newCartCount * 2 + popProduct.purchase_count * 5,
            })
            .eq("id", popProduct.id);
        } else {
          await adminSupabase.from("popular_products").insert({
            product_id,
            cart_add_count: 1,
            popularity_score: 2,
          });
        }
        break;
      }

      case "remove_from_cart": {
        await userSupabase.from("user_cart_history").insert({
          user_id: userId,
          product_id,
          product_name: product_name || "Unknown",
          category: category || "Unknown",
          quantity: quantity || 1,
          action: "removed",
        });
        break;
      }

      case "purchase": {
        await userSupabase.from("user_purchases").insert({
          user_id: userId,
          product_id,
          product_name: product_name || "Unknown",
          category: category || "Unknown",
          price: price || 0,
          quantity: quantity || 1,
        });

        // Update popular products purchase count
        const { data: popProduct } = await adminSupabase
          .from("popular_products")
          .select("id, purchase_count, view_count, cart_add_count")
          .eq("product_id", product_id)
          .maybeSingle();

        if (popProduct) {
          const newPurchaseCount = popProduct.purchase_count + 1;
          await adminSupabase
            .from("popular_products")
            .update({ 
              purchase_count: newPurchaseCount,
              popularity_score: popProduct.view_count * 1 + popProduct.cart_add_count * 2 + newPurchaseCount * 5,
            })
            .eq("id", popProduct.id);
        } else {
          await adminSupabase.from("popular_products").insert({
            product_id,
            purchase_count: 1,
            popularity_score: 5,
          });
        }
        break;
      }

      case "rate": {
        const { rating } = await req.json();
        if (!rating || rating < 1 || rating > 5) {
          return new Response(JSON.stringify({ error: "Invalid rating" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        await userSupabase.from("product_ratings").upsert({
          user_id: userId,
          product_id,
          rating,
        }, { onConflict: "user_id,product_id" });
        break;
      }

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Track behavior error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
