// supabase/functions/jwt-exchange/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create, verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface JWTExchangeRequest {
  current_token?: string;
  refresh_token?: string;
  authorization_code?: string;
  custom_claims: Record<string, any>;
  exchange_type: string;
}

interface JWTExchangeResponse {
  jwt_token: string;
  expires_at: number;
  token_type: string;
  session?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the JWT secret from environment
    const jwtSecret = Deno.env.get("SUPABASE_JWT_SECRET");
    if (!jwtSecret) {
      console.error("JWT secret not configured");
      throw new Error("JWT secret not configured");
    }

    // Parse request body
    const {
      current_token,
      refresh_token,
      authorization_code,
      custom_claims,
      exchange_type
    }: JWTExchangeRequest = await req.json();

    console.log("JWT Exchange Request:", {
      exchange_type,
      has_authorization_code: !!authorization_code,
      has_current_token: !!current_token,
      custom_claims_keys: Object.keys(custom_claims || {})
    });

    if (!exchange_type) {
      console.error("Missing exchange_type parameter");
      return new Response(
        JSON.stringify({ error: "Missing exchange_type parameter" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let user = null;
    let session = null;

    // Handle different exchange types
    if (exchange_type === "authorization_code" && authorization_code) {
      console.log("Starting authorization code exchange process");
      console.log("Authorization code (first 10 chars):", authorization_code.substring(0, 10));
      
      // Exchange authorization code for session
      const { data, error } = await supabaseClient.auth.exchangeCodeForSession(authorization_code);
      
      if (error) {
        console.error("Authorization code exchange failed:", {
          error_message: error.message,
          error_code: error.name,
          error_status: error.status
        });
        return new Response(
          JSON.stringify({ 
            error: "Failed to exchange authorization code",
            message: error.message,
            code: error.name || "code_exchange_failed"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      user = data.user;
      session = data.session;
      console.log("Authorization code exchange successful:", {
        user_id: user?.id,
        user_email: user?.email,
        session_exists: !!session,
        access_token_exists: !!session?.access_token
      });
      
    } else if (exchange_type === "custom_jwt" && current_token) {
      console.log("Starting custom JWT exchange with current token");
      
      // Verify the current Supabase token
      const { data: { user: authUser }, error: userError } = await supabaseClient.auth.getUser(current_token);
      
      if (userError || !authUser) {
        console.error("Current token validation failed:", userError);
        return new Response(
          JSON.stringify({ error: "Invalid or expired token" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      user = authUser;
      console.log("Current token validation successful:", {
        user_id: user?.id,
        user_email: user?.email
      });
      
    } else {
      console.error("Invalid exchange request:", {
        exchange_type,
        has_authorization_code: !!authorization_code,
        has_current_token: !!current_token
      });
      return new Response(
        JSON.stringify({ 
          error: "Invalid exchange type or missing required parameters",
          details: "For authorization_code: provide authorization_code. For custom_jwt: provide current_token."
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!user) {
      console.error("No user found after exchange process");
      return new Response(
        JSON.stringify({ error: "No user found in exchange process" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create enhanced JWT payload
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (60 * 60); // 1 hour from now

    const jwtPayload = {
      // Standard JWT claims
      iss: "voiced-civic-platform",
      sub: user.id,
      aud: "voiced-users",
      exp: expiresAt,
      iat: now,
      jti: crypto.randomUUID(),
      
      // User information
      email: user.email,
      email_verified: user.email_confirmed_at !== null,
      
      // Supabase metadata
      app_metadata: user.app_metadata || {},
      user_metadata: user.user_metadata || {},
      
      // Platform-specific claims
      platform: "voiced-civic",
      role: user.role || "authenticated",
      
      // Custom claims from the request
      ...custom_claims,
      
      // Token metadata
      token_type: exchange_type,
      exchange_source: authorization_code ? "authorization_code" : "current_token"
    };

    console.log("Creating JWT with payload:", {
      user_id: jwtPayload.sub,
      email: jwtPayload.email,
      expires_at: new Date(expiresAt * 1000).toISOString(),
      custom_claims_included: Object.keys(custom_claims || {})
    });

    // Create the JWT
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(jwtSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );

    const jwt = await create({ alg: "HS256", typ: "JWT" }, jwtPayload, key);

    // Log the successful token exchange
    console.log(`JWT token successfully created for user: ${user.id}, type: ${exchange_type}`);

    const response: JWTExchangeResponse = {
      jwt_token: jwt,
      expires_at: expiresAt,
      token_type: exchange_type,
      ...(session && { session: session })
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("JWT Exchange Error - Stack trace:", error);
    console.error("JWT Exchange Error - Message:", error.message);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error during JWT exchange",
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});