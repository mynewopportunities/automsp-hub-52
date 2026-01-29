import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Production-grade CORS - restrict to known origins
const ALLOWED_ORIGINS = [
  "https://id-preview--6cae4156-351f-4189-9a7f-f358f4b517e6.lovable.app",
  "https://automsp.lovable.app",
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  // In development, allow localhost
  const isDev = origin?.includes("localhost") || origin?.includes("127.0.0.1");
  const isAllowed = origin && (ALLOWED_ORIGINS.includes(origin) || isDev);
  
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
}

// Cryptographically secure hash function for token validation
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Input validation helpers
function sanitizeString(input: unknown, maxLength: number = 1000): string | null {
  if (typeof input !== 'string') return null;
  return input.trim().slice(0, maxLength);
}

function validateToken(token: unknown): string | null {
  if (typeof token !== 'string') return null;
  // Token should be exactly 32 alphanumeric characters
  if (!/^[A-Za-z0-9]{32}$/.test(token)) return null;
  return token;
}

function validatePriority(priority: unknown): string {
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  if (typeof priority === 'string' && validPriorities.includes(priority)) {
    return priority;
  }
  return 'medium';
}

// Rate limiting map (in-memory, per-instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per window
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate token endpoint
    if (path === "validate") {
      const token = validateToken(body.token);
      if (!token) {
        return new Response(JSON.stringify({ error: "Valid token required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Rate limit by token hash (to prevent enumeration)
      const tokenHash = await hashToken(token);
      if (!checkRateLimit(`validate:${tokenHash.slice(0, 16)}`)) {
        return new Response(JSON.stringify({ error: "Too many requests" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const { data: portalToken, error } = await supabase
        .from("customer_portal_tokens")
        .select("*, clients(id, name, organization_id)")
        .eq("token_hash", tokenHash)
        .eq("is_active", true)
        .single();

      if (error || !portalToken) {
        // Constant-time response to prevent timing attacks
        await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
        return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check expiration
      if (portalToken.expires_at && new Date(portalToken.expires_at) < new Date()) {
        return new Response(JSON.stringify({ error: "Token expired" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update last used (non-blocking)
      supabase
        .from("customer_portal_tokens")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", portalToken.id)
        .then(() => {});

      return new Response(JSON.stringify({
        valid: true,
        client: portalToken.clients,
        email: portalToken.email,
        name: portalToken.name,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get tickets for client
    if (path === "tickets") {
      const token = validateToken(body.token);
      if (!token) {
        return new Response(JSON.stringify({ error: "Valid token required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const tokenHash = await hashToken(token);
      
      const { data: portalToken, error: tokenError } = await supabase
        .from("customer_portal_tokens")
        .select("client_id, expires_at")
        .eq("token_hash", tokenHash)
        .eq("is_active", true)
        .single();

      if (tokenError || !portalToken) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check expiration
      if (portalToken.expires_at && new Date(portalToken.expires_at) < new Date()) {
        return new Response(JSON.stringify({ error: "Token expired" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: tickets, error: ticketsError } = await supabase
        .from("tickets")
        .select("id, subject, description, status, priority, created_at, updated_at, sla_due_date, resolved_at")
        .eq("client_id", portalToken.client_id)
        .order("created_at", { ascending: false })
        .limit(100); // Prevent excessive data retrieval

      if (ticketsError) {
        console.error("Error fetching tickets:", ticketsError);
        return new Response(JSON.stringify({ error: "Failed to fetch tickets" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ tickets }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Submit new ticket
    if (path === "submit-ticket") {
      const token = validateToken(body.token);
      const subject = sanitizeString(body.subject, 200);
      const description = sanitizeString(body.description, 5000);
      const priority = validatePriority(body.priority);
      
      if (!token) {
        return new Response(JSON.stringify({ error: "Valid token required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!subject || subject.length < 3) {
        return new Response(JSON.stringify({ error: "Subject must be at least 3 characters" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const tokenHash = await hashToken(token);
      
      // Rate limit ticket submissions per token
      if (!checkRateLimit(`submit:${tokenHash.slice(0, 16)}`)) {
        return new Response(JSON.stringify({ error: "Too many ticket submissions. Please wait." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const { data: portalToken, error: tokenError } = await supabase
        .from("customer_portal_tokens")
        .select("client_id, email, expires_at, clients(organization_id)")
        .eq("token_hash", tokenHash)
        .eq("is_active", true)
        .single();

      if (tokenError || !portalToken) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check expiration
      if (portalToken.expires_at && new Date(portalToken.expires_at) < new Date()) {
        return new Response(JSON.stringify({ error: "Token expired" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: ticket, error: ticketError } = await supabase
        .from("tickets")
        .insert({
          client_id: portalToken.client_id,
          organization_id: (portalToken.clients as any).organization_id,
          subject,
          description: description || null,
          priority,
          status: "open",
          customer_submitted: true,
          customer_email: portalToken.email,
        })
        .select("id, subject, status, created_at")
        .single();

      if (ticketError) {
        console.error("Error creating ticket:", ticketError);
        return new Response(JSON.stringify({ error: "Failed to create ticket" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        ticket: {
          id: ticket.id,
          subject: ticket.subject,
          status: ticket.status,
          created_at: ticket.created_at,
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Customer portal error:", error);
    // Don't expose internal error details
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...getCorsHeaders(origin), "Content-Type": "application/json" } }
    );
  }
});