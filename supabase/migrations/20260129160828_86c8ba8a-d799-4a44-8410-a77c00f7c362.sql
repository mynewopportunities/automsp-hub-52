-- ===========================================
-- ENTERPRISE SECURITY HARDENING MIGRATION
-- ===========================================
-- This migration adds explicit deny policies for unauthenticated access
-- to all tables containing sensitive data, following zero-trust principles.

-- 1. PROFILES TABLE - Block unauthenticated access to user emails
-- Drop existing policies and recreate with stricter controls
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Recreate with explicit auth.uid() IS NOT NULL checks
CREATE POLICY "Authenticated users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() IS NOT NULL AND id = auth.uid());

CREATE POLICY "Authenticated users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() IS NOT NULL AND id = auth.uid());

CREATE POLICY "Authenticated users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND id = auth.uid());

-- 2. CLIENTS TABLE - Block unauthenticated access to customer PII
DROP POLICY IF EXISTS "Members can view clients in their org" ON public.clients;
DROP POLICY IF EXISTS "Admins and AMs can create clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update clients they manage" ON public.clients;
DROP POLICY IF EXISTS "Users can delete clients they manage" ON public.clients;

CREATE POLICY "Authenticated members can view clients in their org" ON public.clients
FOR SELECT USING (auth.uid() IS NOT NULL AND organization_id = get_user_org_id(auth.uid()));

CREATE POLICY "Authenticated admins and AMs can create clients" ON public.clients
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL 
  AND organization_id = get_user_org_id(auth.uid()) 
  AND get_user_role(auth.uid()) IN ('admin', 'account_manager')
);

CREATE POLICY "Authenticated users can update clients they manage" ON public.clients
FOR UPDATE USING (auth.uid() IS NOT NULL AND can_manage_client(auth.uid(), id));

CREATE POLICY "Authenticated users can delete clients they manage" ON public.clients
FOR DELETE USING (auth.uid() IS NOT NULL AND can_manage_client(auth.uid(), id));

-- 3. CUSTOMER_PORTAL_TOKENS TABLE - Critical! Contains access tokens
DROP POLICY IF EXISTS "Account managers can view their client tokens" ON public.customer_portal_tokens;
DROP POLICY IF EXISTS "Admins can manage portal tokens" ON public.customer_portal_tokens;

CREATE POLICY "Authenticated admins can manage portal tokens" ON public.customer_portal_tokens
FOR ALL USING (auth.uid() IS NOT NULL AND is_admin_of_org(auth.uid(), organization_id));

CREATE POLICY "Authenticated AMs can view their client tokens" ON public.customer_portal_tokens
FOR SELECT USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM clients c
    JOIN organization_memberships om ON c.organization_id = om.organization_id
    WHERE c.id = customer_portal_tokens.client_id 
      AND om.user_id = auth.uid() 
      AND (om.role = 'admin' OR (om.role = 'account_manager' AND c.assigned_to = auth.uid()))
  )
);

-- 4. TICKETS TABLE - Block unauthenticated access to customer emails
DROP POLICY IF EXISTS "Members can view tickets in their org" ON public.tickets;
DROP POLICY IF EXISTS "Admins and AMs can create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins and AMs can update tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins can delete tickets" ON public.tickets;

CREATE POLICY "Authenticated members can view tickets in their org" ON public.tickets
FOR SELECT USING (auth.uid() IS NOT NULL AND organization_id = get_user_org_id(auth.uid()));

CREATE POLICY "Authenticated admins and AMs can create tickets" ON public.tickets
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL 
  AND organization_id = get_user_org_id(auth.uid()) 
  AND get_user_role(auth.uid()) IN ('admin', 'account_manager')
);

CREATE POLICY "Authenticated admins and AMs can update tickets" ON public.tickets
FOR UPDATE USING (
  auth.uid() IS NOT NULL 
  AND organization_id = get_user_org_id(auth.uid()) 
  AND get_user_role(auth.uid()) IN ('admin', 'account_manager')
);

CREATE POLICY "Authenticated admins can delete tickets" ON public.tickets
FOR DELETE USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin') 
  AND organization_id = get_user_org_id(auth.uid())
);

-- 5. INTEGRATIONS TABLE - Critical! May contain API keys/secrets
DROP POLICY IF EXISTS "Admins can view integrations" ON public.integrations;
DROP POLICY IF EXISTS "Admins can create integrations" ON public.integrations;
DROP POLICY IF EXISTS "Admins can update integrations" ON public.integrations;
DROP POLICY IF EXISTS "Admins can delete integrations" ON public.integrations;

CREATE POLICY "Authenticated admins can view integrations" ON public.integrations
FOR SELECT USING (auth.uid() IS NOT NULL AND is_admin_of_org(auth.uid(), organization_id));

CREATE POLICY "Authenticated admins can create integrations" ON public.integrations
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND is_admin_of_org(auth.uid(), organization_id));

CREATE POLICY "Authenticated admins can update integrations" ON public.integrations
FOR UPDATE USING (auth.uid() IS NOT NULL AND is_admin_of_org(auth.uid(), organization_id));

CREATE POLICY "Authenticated admins can delete integrations" ON public.integrations
FOR DELETE USING (auth.uid() IS NOT NULL AND is_admin_of_org(auth.uid(), organization_id));

-- 6. AUDIT_LOGS TABLE - Contains sensitive action history
DROP POLICY IF EXISTS "Members can view audit logs in their org" ON public.audit_logs;
DROP POLICY IF EXISTS "Authenticated users can insert audit logs for their org" ON public.audit_logs;

CREATE POLICY "Authenticated members can view audit logs in their org" ON public.audit_logs
FOR SELECT USING (auth.uid() IS NOT NULL AND organization_id = get_user_org_id(auth.uid()));

CREATE POLICY "Authenticated users can insert audit logs for their org" ON public.audit_logs
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND organization_id = get_user_org_id(auth.uid()));

-- 7. ORGANIZATIONS TABLE - Fix the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view their organization" ON public.organizations;
DROP POLICY IF EXISTS "Admins can update their organization" ON public.organizations;
DROP POLICY IF EXISTS "Authenticated users without org can create organization" ON public.organizations;

CREATE POLICY "Authenticated users can view their organization" ON public.organizations
FOR SELECT USING (
  auth.uid() IS NOT NULL 
  AND (
    is_member_of_org(auth.uid(), id) 
    OR NOT EXISTS (SELECT 1 FROM organization_memberships WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Authenticated admins can update their organization" ON public.organizations
FOR UPDATE USING (auth.uid() IS NOT NULL AND is_admin_of_org(auth.uid(), id));

CREATE POLICY "Authenticated users without org can create organization" ON public.organizations
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM organization_memberships WHERE user_id = auth.uid())
);

-- 8. ORGANIZATION_MEMBERSHIPS TABLE - Protect org structure
DROP POLICY IF EXISTS "Members can view org memberships" ON public.organization_memberships;
DROP POLICY IF EXISTS "Admins can create memberships" ON public.organization_memberships;
DROP POLICY IF EXISTS "Admins can update memberships" ON public.organization_memberships;
DROP POLICY IF EXISTS "Admins can delete memberships or self-remove" ON public.organization_memberships;

CREATE POLICY "Authenticated members can view org memberships" ON public.organization_memberships
FOR SELECT USING (auth.uid() IS NOT NULL AND is_member_of_org(auth.uid(), organization_id));

CREATE POLICY "Authenticated admins can create memberships" ON public.organization_memberships
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    is_admin_of_org(auth.uid(), organization_id) 
    OR NOT EXISTS (SELECT 1 FROM organization_memberships om WHERE om.organization_id = organization_memberships.organization_id)
  )
);

CREATE POLICY "Authenticated admins can update memberships" ON public.organization_memberships
FOR UPDATE USING (auth.uid() IS NOT NULL AND is_admin_of_org(auth.uid(), organization_id));

CREATE POLICY "Authenticated admins can delete memberships or self-remove" ON public.organization_memberships
FOR DELETE USING (
  auth.uid() IS NOT NULL 
  AND (is_admin_of_org(auth.uid(), organization_id) OR user_id = auth.uid())
);

-- 9. INTERACTIONS TABLE - Contains client communication data
DROP POLICY IF EXISTS "Members can view interactions in their org" ON public.interactions;
DROP POLICY IF EXISTS "Admins and AMs can create interactions" ON public.interactions;
DROP POLICY IF EXISTS "Users can update their own interactions" ON public.interactions;
DROP POLICY IF EXISTS "Users can delete their own interactions" ON public.interactions;

CREATE POLICY "Authenticated members can view interactions in their org" ON public.interactions
FOR SELECT USING (auth.uid() IS NOT NULL AND organization_id = get_user_org_id(auth.uid()));

CREATE POLICY "Authenticated admins and AMs can create interactions" ON public.interactions
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL 
  AND organization_id = get_user_org_id(auth.uid()) 
  AND get_user_role(auth.uid()) IN ('admin', 'account_manager')
);

CREATE POLICY "Authenticated users can update their own interactions" ON public.interactions
FOR UPDATE USING (
  auth.uid() IS NOT NULL 
  AND (created_by = auth.uid() OR has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Authenticated users can delete their own interactions" ON public.interactions
FOR DELETE USING (
  auth.uid() IS NOT NULL 
  AND (created_by = auth.uid() OR has_role(auth.uid(), 'admin'))
);