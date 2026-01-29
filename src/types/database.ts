// Application-level type definitions
// These extend the auto-generated Supabase types

export type AppRole = 'admin' | 'account_manager' | 'viewer';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type InteractionType = 'call' | 'email' | 'meeting' | 'note' | 'other';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export type IntegrationService = 'hubspot' | 'servicenow' | 'connectwise' | 'custom';

export interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMembership {
  id: string;
  organization_id: string;
  user_id: string;
  role: AppRole;
  invited_by: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  organization_id: string;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contract_value: number | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  assigned_to: string | null;
  health_score: number;
  risk_level: RiskLevel;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  client_id: string;
  organization_id: string;
  created_by: string;
  type: InteractionType;
  subject: string | null;
  details: string | null;
  sentiment: Sentiment | null;
  interaction_date: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  client_id: string;
  organization_id: string;
  subject: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  sla_due_date: string | null;
  resolved_at: string | null;
  created_by: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface Integration {
  id: string;
  organization_id: string;
  service: IntegrationService;
  name: string;
  config: Record<string, unknown>;
  is_active: boolean;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

// Extended types with relations
export interface ClientWithAssignee extends Client {
  assignee?: Profile;
}

export interface InteractionWithCreator extends Interaction {
  creator?: Profile;
  client?: Client;
}

export interface TicketWithRelations extends Ticket {
  client?: Client;
  creator?: Profile;
  assignee?: Profile;
}

export interface MembershipWithProfile extends OrganizationMembership {
  profile?: Profile;
}

// Dashboard aggregation types
export interface RiskSummary {
  low: number;
  medium: number;
  high: number;
  critical: number;
  total: number;
}

export interface PortfolioHealth {
  averageScore: number;
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
}

export interface AtRiskClient {
  client: Client;
  primaryRiskFactor: string;
  daysSinceContact: number;
}
