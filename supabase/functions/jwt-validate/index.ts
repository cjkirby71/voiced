// supabase/functions/jwt-validate/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface JWTValidateRequest {
  jwt_token: string;
  validation_type: string;
}

interface JWTValidateResponse {
  valid: boolean;
  claims?: Record<string, any>;
  expires_at?: number;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the JWT secret from environment
    const jwtSecret = Deno.env.get("SUPABASE_JWT_SECRET");
    if (!jwtSecret) {
      throw new Error("JWT secret not configured");
    }

    // Parse request body
    const {
      jwt_token,
      validation_type
    }: JWTValidateRequest = await req.json();

    if (!jwt_token || !validation_type) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Missing required parameters" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create the key for verification
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(jwtSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );

    try {
      // Verify and decode the JWT
      const payload = await verify(jwt_token, key);
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: "Token has expired" 
          }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Validate token type if specified
      if (validation_type && payload.token_type !== validation_type) {
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: "Invalid token type" 
          }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Log successful validation for monitoring
      console.log(`JWT token validated for user: ${payload.sub}, type: ${payload.token_type}`);

      const response: JWTValidateResponse = {
        valid: true,
        claims: payload,
        expires_at: payload.exp as number
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (verifyError) {
      // JWT verification failed
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Invalid JWT token signature" 
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

  } catch (error) {
    console.error("JWT Validation Error:", error);
    
    return new Response(
      JSON.stringify({ 
        valid: false,
        error: "Internal server error during JWT validation",
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});