import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Production-grade CORS - restrict to known origins
const ALLOWED_ORIGINS = [
  "https://id-preview--6cae4156-351f-4189-9a7f-f358f4b517e6.lovable.app",
  "https://automsp.lovable.app",
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const isDev = origin?.includes("localhost") || origin?.includes("127.0.0.1");
  const isAllowed = origin && (ALLOWED_ORIGINS.includes(origin) || isDev);
  
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
}

// Cryptographically secure token generation
function generateToken(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(36).padStart(2, '0')).join('').slice(0, 32);
}

// Hash token for storage
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Input validation
function validateEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
  if (trimmed.length > 254) return null;
  return trimmed;
}

function validateUUID(id: unknown): string | null {
  if (typeof id !== 'string') return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  return id;
}

function sanitizeString(input: unknown, maxLength: number = 100): string | null {
  if (typeof input !== 'string') return null;
  return input.trim().slice(0, maxLength);
}

function validateExpiresDays(days: unknown): number | null {
  if (days === undefined || days === null) return null;
  const num = Number(days);
  if (isNaN(num) || num < 1 || num > 365) return null;
  return Math.floor(num);
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clientId = validateUUID(body.client_id);
    const email = validateEmail(body.email);
    const name = sanitizeString(body.name, 100);
    const expiresDays = validateExpiresDays(body.expires_days);

    if (!clientId) {
      return new Response(JSON.stringify({ error: "Valid client_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email) {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user has access to this client (RLS will enforce this)
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id, organization_id, name")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return new Response(JSON.stringify({ error: "Client not found or access denied" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user is admin or account manager
    const { data: membership, error: membershipError } = await supabase
      .from("organization_memberships")
      .select("role")
      .eq("user_id", userId)
      .eq("organization_id", client.organization_id)
      .single();

    if (membershipError || !membership || !['admin', 'account_manager'].includes(membership.role)) {
      return new Response(JSON.stringify({ error: "Insufficient permissions" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate cryptographically secure token
    const accessToken = generateToken();
    const tokenHash = await hashToken(accessToken);

    // Calculate expiration (default 30 days if not specified)
    const effectiveExpireDays = expiresDays || 30;
    const expiresAt = new Date(Date.now() + effectiveExpireDays * 24 * 60 * 60 * 1000).toISOString();

    // Use service role to bypass RLS for token management
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Deactivate existing tokens for this email/client combo
    await serviceClient
      .from("customer_portal_tokens")
      .update({ is_active: false })
      .eq("client_id", clientId)
      .eq("email", email);

    // Insert new token
    const { error: insertError } = await serviceClient
      .from("customer_portal_tokens")
      .insert({
        client_id: clientId,
        organization_id: client.organization_id,
        token_hash: tokenHash,
        email,
        name: name || null,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("Error creating token:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create token" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate portal URL - use origin or fallback
    const baseUrl = origin || "https://automsp.lovable.app";
    const portalUrl = `${baseUrl}/customer-portal/login?token=${accessToken}`;

    return new Response(JSON.stringify({
      success: true,
      token: accessToken,
      portal_url: portalUrl,
      expires_at: expiresAt,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...getCorsHeaders(origin), "Content-Type": "application/json" } }
    );
  }
});