import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Production-grade CORS
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

const DEMO_CLIENTS = [
  { name: "TechFlow Solutions", contact_name: "Sarah Chen", contact_email: "sarah@techflow.io", contract_value: 48000, health_score: 92, risk_level: "low" },
  { name: "DataPrime Inc", contact_name: "Michael Roberts", contact_email: "m.roberts@dataprime.com", contract_value: 72000, health_score: 78, risk_level: "medium" },
  { name: "CloudNine Systems", contact_name: "Emily Watson", contact_email: "emily@cloudnine.tech", contract_value: 36000, health_score: 45, risk_level: "high" },
  { name: "Nexus Dynamics", contact_name: "James Park", contact_email: "jpark@nexusdyn.com", contract_value: 120000, health_score: 88, risk_level: "low" },
  { name: "Pioneer Health IT", contact_name: "Lisa Thompson", contact_email: "lthompson@pioneerhealth.org", contract_value: 96000, health_score: 65, risk_level: "medium" },
  { name: "Quantum Financial", contact_name: "Robert Kim", contact_email: "rkim@quantumfin.com", contract_value: 156000, health_score: 32, risk_level: "critical" },
  { name: "Metro Law Group", contact_name: "Jennifer Adams", contact_email: "jadams@metrolaw.com", contract_value: 60000, health_score: 85, risk_level: "low" },
  { name: "Apex Manufacturing", contact_name: "David Miller", contact_email: "dmiller@apexmfg.com", contract_value: 84000, health_score: 55, risk_level: "high" },
  { name: "Stellar Education", contact_name: "Amanda Green", contact_email: "agreen@stellaredu.org", contract_value: 42000, health_score: 91, risk_level: "low" },
  { name: "Harbor Logistics", contact_name: "Tom Wilson", contact_email: "twilson@harborlog.com", contract_value: 108000, health_score: 72, risk_level: "medium" },
];

const TICKET_SUBJECTS = [
  "Email server experiencing intermittent outages",
  "VPN connectivity issues for remote workers",
  "Backup job failures on production server",
  "User unable to access shared network drive",
  "Slow internet speeds affecting productivity",
  "Printer not connecting to network",
  "Software license renewal needed",
  "Security patch deployment required",
  "New employee onboarding - IT setup",
  "Password reset request",
  "Cloud migration planning consultation",
  "Firewall rule update needed",
  "Data recovery request",
  "Hardware replacement - aging workstations",
  "Network segmentation review",
];

const INTERACTION_SUBJECTS = [
  "Quarterly business review",
  "Contract renewal discussion",
  "Emergency support call",
  "New project kickoff meeting",
  "Security assessment follow-up",
  "Budget planning session",
  "Technical roadmap presentation",
  "Escalation from support ticket",
  "New service proposal",
  "Client satisfaction check-in",
];

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

    // Get the user's organization
    const { data: membership, error: membershipError } = await supabase
      .from("organization_memberships")
      .select("organization_id, role")
      .eq("user_id", userId)
      .single();

    if (membershipError || !membership) {
      return new Response(JSON.stringify({ error: "No organization found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only admins can seed demo data
    if (membership.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const organizationId = membership.organization_id;

    // Check if demo data already exists
    const { count: existingClients } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId);

    if (existingClients && existingClients > 0) {
      return new Response(
        JSON.stringify({ message: "Demo data already exists", seeded: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert demo clients
    const clientsToInsert = DEMO_CLIENTS.map((client) => ({
      ...client,
      organization_id: organizationId,
      assigned_to: userId,
      contract_start_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      contract_end_date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: `Demo client for ${client.name}`,
    }));

    const { data: insertedClients, error: clientsError } = await supabase
      .from("clients")
      .insert(clientsToInsert)
      .select();

    if (clientsError) {
      console.error("Error inserting clients:", clientsError);
      return new Response(JSON.stringify({ error: "Failed to seed clients" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert demo tickets
    const ticketsToInsert = insertedClients!.flatMap((client, clientIndex) => {
      const numTickets = Math.floor(Math.random() * 3) + 1;
      return Array.from({ length: numTickets }, (_, i) => {
        const statuses = ["open", "in_progress", "resolved", "closed"];
        const priorities = ["low", "medium", "high", "critical"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const daysAgo = Math.floor(Math.random() * 30);
        const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        const slaDueDate = new Date(createdAt.getTime() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000);
        
        return {
          client_id: client.id,
          organization_id: organizationId,
          subject: TICKET_SUBJECTS[(clientIndex * 3 + i) % TICKET_SUBJECTS.length],
          description: `Support ticket for ${client.name}. This is demo data.`,
          status,
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          sla_due_date: slaDueDate.toISOString(),
          created_by: userId,
          assigned_to: userId,
          resolved_at: status === "resolved" || status === "closed" ? new Date().toISOString() : null,
        };
      });
    });

    const { error: ticketsError } = await supabase.from("tickets").insert(ticketsToInsert);
    if (ticketsError) {
      console.error("Error inserting tickets:", ticketsError);
      // Continue anyway, clients were created
    }

    // Insert demo interactions
    const interactionsToInsert = insertedClients!.flatMap((client, clientIndex) => {
      const numInteractions = Math.floor(Math.random() * 4) + 2;
      return Array.from({ length: numInteractions }, (_, i) => {
        const types = ["call", "email", "meeting", "note"];
        const sentiments = ["positive", "neutral", "negative"];
        const daysAgo = Math.floor(Math.random() * 60);
        
        return {
          client_id: client.id,
          organization_id: organizationId,
          created_by: userId,
          type: types[Math.floor(Math.random() * types.length)],
          subject: INTERACTION_SUBJECTS[(clientIndex * 2 + i) % INTERACTION_SUBJECTS.length],
          details: `Interaction with ${client.contact_name} at ${client.name}. This is demo data.`,
          sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
          interaction_date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        };
      });
    });

    const { error: interactionsError } = await supabase.from("interactions").insert(interactionsToInsert);
    if (interactionsError) {
      console.error("Error inserting interactions:", interactionsError);
      // Continue anyway
    }

    return new Response(
      JSON.stringify({
        message: "Demo data seeded successfully",
        seeded: true,
        counts: {
          clients: insertedClients?.length ?? 0,
          tickets: ticketsToInsert.length,
          interactions: interactionsToInsert.length,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error seeding demo data:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...getCorsHeaders(origin), "Content-Type": "application/json" } }
    );
  }
});