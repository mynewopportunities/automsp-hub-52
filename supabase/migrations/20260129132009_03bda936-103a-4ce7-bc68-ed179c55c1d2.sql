-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'account_manager', 'viewer');

-- Organizations table (tenants)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Organization memberships (links users to orgs with roles)
CREATE TABLE public.organization_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Clients table (end customers of each MSP)
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contract_value DECIMAL(12,2),
  contract_start_date DATE,
  contract_end_date DATE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  health_score INTEGER DEFAULT 50 CHECK (health_score >= 0 AND health_score <= 100),
  risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Interactions table (calls, emails, meetings)
CREATE TABLE public.interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'other')),
  subject TEXT,
  details TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  interaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tickets table (support tickets)
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  sla_due_date TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Integrations table (API credentials for external services)
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  service TEXT NOT NULL CHECK (service IN ('hubspot', 'servicenow', 'connectwise', 'custom')),
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, service, name)
);

-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Get user's organization ID
CREATE OR REPLACE FUNCTION public.get_user_org_id(user_uuid UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.organization_memberships WHERE user_id = user_uuid LIMIT 1
$$;

-- Helper function: Check if user is member of organization
CREATE OR REPLACE FUNCTION public.is_member_of_org(user_uuid UUID, org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_memberships
    WHERE user_id = user_uuid AND organization_id = org_id
  )
$$;

-- Helper function: Get user's role in their org
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.organization_memberships WHERE user_id = user_uuid LIMIT 1
$$;

-- Helper function: Check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, required_role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_memberships
    WHERE user_id = user_uuid AND role = required_role
  )
$$;

-- Helper function: Check if user is admin of organization
CREATE OR REPLACE FUNCTION public.is_admin_of_org(user_uuid UUID, org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_memberships
    WHERE user_id = user_uuid AND organization_id = org_id AND role = 'admin'
  )
$$;

-- Helper function: Check if user can manage client (admin or assigned AM)
CREATE OR REPLACE FUNCTION public.can_manage_client(user_uuid UUID, client_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clients c
    JOIN public.organization_memberships om ON c.organization_id = om.organization_id
    WHERE c.id = client_uuid 
      AND om.user_id = user_uuid
      AND (om.role = 'admin' OR (om.role = 'account_manager' AND c.assigned_to = user_uuid))
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- RLS Policies for organizations
CREATE POLICY "Users can view their organization"
  ON public.organizations FOR SELECT
  USING (public.is_member_of_org(auth.uid(), id));

CREATE POLICY "Admins can update their organization"
  ON public.organizations FOR UPDATE
  USING (public.is_admin_of_org(auth.uid(), id));

CREATE POLICY "Anyone can create an organization"
  ON public.organizations FOR INSERT
  WITH CHECK (true);

-- RLS Policies for organization_memberships
CREATE POLICY "Members can view org memberships"
  ON public.organization_memberships FOR SELECT
  USING (public.is_member_of_org(auth.uid(), organization_id));

CREATE POLICY "Admins can create memberships"
  ON public.organization_memberships FOR INSERT
  WITH CHECK (
    public.is_admin_of_org(auth.uid(), organization_id) 
    OR NOT EXISTS (SELECT 1 FROM public.organization_memberships WHERE organization_id = organization_memberships.organization_id)
  );

CREATE POLICY "Admins can update memberships"
  ON public.organization_memberships FOR UPDATE
  USING (public.is_admin_of_org(auth.uid(), organization_id));

CREATE POLICY "Admins can delete memberships or self-remove"
  ON public.organization_memberships FOR DELETE
  USING (
    public.is_admin_of_org(auth.uid(), organization_id) 
    OR user_id = auth.uid()
  );

-- RLS Policies for clients
CREATE POLICY "Members can view clients in their org"
  ON public.clients FOR SELECT
  USING (organization_id = public.get_user_org_id(auth.uid()));

CREATE POLICY "Admins and AMs can create clients"
  ON public.clients FOR INSERT
  WITH CHECK (
    organization_id = public.get_user_org_id(auth.uid())
    AND public.get_user_role(auth.uid()) IN ('admin', 'account_manager')
  );

CREATE POLICY "Users can update clients they manage"
  ON public.clients FOR UPDATE
  USING (public.can_manage_client(auth.uid(), id));

CREATE POLICY "Users can delete clients they manage"
  ON public.clients FOR DELETE
  USING (public.can_manage_client(auth.uid(), id));

-- RLS Policies for interactions
CREATE POLICY "Members can view interactions in their org"
  ON public.interactions FOR SELECT
  USING (organization_id = public.get_user_org_id(auth.uid()));

CREATE POLICY "Admins and AMs can create interactions"
  ON public.interactions FOR INSERT
  WITH CHECK (
    organization_id = public.get_user_org_id(auth.uid())
    AND public.get_user_role(auth.uid()) IN ('admin', 'account_manager')
  );

CREATE POLICY "Users can update their own interactions"
  ON public.interactions FOR UPDATE
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own interactions"
  ON public.interactions FOR DELETE
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for tickets
CREATE POLICY "Members can view tickets in their org"
  ON public.tickets FOR SELECT
  USING (organization_id = public.get_user_org_id(auth.uid()));

CREATE POLICY "Admins and AMs can create tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (
    organization_id = public.get_user_org_id(auth.uid())
    AND public.get_user_role(auth.uid()) IN ('admin', 'account_manager')
  );

CREATE POLICY "Admins and AMs can update tickets"
  ON public.tickets FOR UPDATE
  USING (
    organization_id = public.get_user_org_id(auth.uid())
    AND public.get_user_role(auth.uid()) IN ('admin', 'account_manager')
  );

CREATE POLICY "Admins can delete tickets"
  ON public.tickets FOR DELETE
  USING (public.has_role(auth.uid(), 'admin') AND organization_id = public.get_user_org_id(auth.uid()));

-- RLS Policies for integrations (Admin only)
CREATE POLICY "Admins can view integrations"
  ON public.integrations FOR SELECT
  USING (public.is_admin_of_org(auth.uid(), organization_id));

CREATE POLICY "Admins can create integrations"
  ON public.integrations FOR INSERT
  WITH CHECK (public.is_admin_of_org(auth.uid(), organization_id));

CREATE POLICY "Admins can update integrations"
  ON public.integrations FOR UPDATE
  USING (public.is_admin_of_org(auth.uid(), organization_id));

CREATE POLICY "Admins can delete integrations"
  ON public.integrations FOR DELETE
  USING (public.is_admin_of_org(auth.uid(), organization_id));

-- RLS Policies for audit_logs (read-only for members)
CREATE POLICY "Members can view audit logs in their org"
  ON public.audit_logs FOR SELECT
  USING (organization_id = public.get_user_org_id(auth.uid()));

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- Trigger function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_organization_memberships_user ON public.organization_memberships(user_id);
CREATE INDEX idx_organization_memberships_org ON public.organization_memberships(organization_id);
CREATE INDEX idx_clients_org ON public.clients(organization_id);
CREATE INDEX idx_clients_assigned ON public.clients(assigned_to);
CREATE INDEX idx_clients_risk ON public.clients(risk_level);
CREATE INDEX idx_interactions_client ON public.interactions(client_id);
CREATE INDEX idx_interactions_org ON public.interactions(organization_id);
CREATE INDEX idx_tickets_client ON public.tickets(client_id);
CREATE INDEX idx_tickets_org ON public.tickets(organization_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_audit_logs_org ON public.audit_logs(organization_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);