-- Fix the permissive RLS policies

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Anyone can create an organization" ON public.organizations;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- Create more restrictive organization creation policy
-- Users can only create an organization during signup flow (no existing membership)
CREATE POLICY "Authenticated users without org can create organization"
  ON public.organizations FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND NOT EXISTS (SELECT 1 FROM public.organization_memberships WHERE user_id = auth.uid())
  );

-- Audit logs insert policy - only authenticated users can create logs for their org
CREATE POLICY "Authenticated users can insert audit logs for their org"
  ON public.audit_logs FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND organization_id = public.get_user_org_id(auth.uid())
  );

-- Fix function search_path for update_updated_at_column
DROP TRIGGER IF EXISTS update_organizations_updated_at ON public.organizations;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
DROP TRIGGER IF EXISTS update_tickets_updated_at ON public.tickets;
DROP TRIGGER IF EXISTS update_integrations_updated_at ON public.integrations;

DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
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