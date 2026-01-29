import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple hash function for token validation
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    const body = req.method === "POST" ? await req.json() : {};

    // Validate token endpoint
    if (path === "validate" && req.method === "POST") {
      const { token } = body;
      if (!token) {
        return new Response(JSON.stringify({ error: "Token required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const tokenHash = await hashToken(token);
      
      const { data: portalToken, error } = await supabase
        .from("customer_portal_tokens")
        .select("*, clients(id, name, organization_id)")
        .eq("token_hash", tokenHash)
        .eq("is_active", true)
        .single();

      if (error || !portalToken) {
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

      // Update last used
      await supabase
        .from("customer_portal_tokens")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", portalToken.id);

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
    if (path === "tickets" && req.method === "POST") {
      const { token } = body;
      if (!token) {
        return new Response(JSON.stringify({ error: "Token required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const tokenHash = await hashToken(token);
      
      const { data: portalToken, error: tokenError } = await supabase
        .from("customer_portal_tokens")
        .select("client_id")
        .eq("token_hash", tokenHash)
        .eq("is_active", true)
        .single();

      if (tokenError || !portalToken) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: tickets, error: ticketsError } = await supabase
        .from("tickets")
        .select("id, subject, description, status, priority, created_at, updated_at, sla_due_date, resolved_at")
        .eq("client_id", portalToken.client_id)
        .order("created_at", { ascending: false });

      if (ticketsError) {
        console.error("Error fetching tickets:", ticketsError);
        throw ticketsError;
      }

      return new Response(JSON.stringify({ tickets }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Submit new ticket
    if (path === "submit-ticket" && req.method === "POST") {
      const { token, subject, description, priority } = body;
      
      if (!token || !subject) {
        return new Response(JSON.stringify({ error: "Token and subject required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const tokenHash = await hashToken(token);
      
      const { data: portalToken, error: tokenError } = await supabase
        .from("customer_portal_tokens")
        .select("client_id, email, clients(organization_id)")
        .eq("token_hash", tokenHash)
        .eq("is_active", true)
        .single();

      if (tokenError || !portalToken) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
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
          priority: priority || "medium",
          status: "open",
          customer_submitted: true,
          customer_email: portalToken.email,
        })
        .select()
        .single();

      if (ticketError) {
        console.error("Error creating ticket:", ticketError);
        throw ticketError;
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
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
