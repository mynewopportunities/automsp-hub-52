-- Fix SECURITY DEFINER views to use SECURITY INVOKER
-- Drop and recreate views with proper security model

-- 1. Drop the existing views
DROP VIEW IF EXISTS public.clients_secure;
DROP VIEW IF EXISTS public.integrations_secure;

-- 2. Recreate clients_secure view with SECURITY INVOKER
-- This will inherit RLS from the underlying table and use row-level checks
CREATE VIEW public.clients_secure 
WITH (security_invoker = true)
AS
SELECT 
  c.id,
  c.name,
  c.organization_id,
  c.health_score,
  c.risk_level,
  c.assigned_to,
  c.created_at,
  c.updated_at,
  -- Sensitive fields only visible to admins and account managers
  CASE 
    WHEN get_user_role(auth.uid()) IN ('admin', 'account_manager') THEN c.contact_name
    ELSE NULL
  END as contact_name,
  CASE 
    WHEN get_user_role(auth.uid()) IN ('admin', 'account_manager') THEN c.contact_email
    ELSE NULL
  END as contact_email,
  CASE 
    WHEN get_user_role(auth.uid()) IN ('admin', 'account_manager') THEN c.contact_phone
    ELSE NULL
  END as contact_phone,
  CASE 
    WHEN get_user_role(auth.uid()) IN ('admin', 'account_manager') THEN c.contract_value
    ELSE NULL
  END as contract_value,
  CASE 
    WHEN get_user_role(auth.uid()) IN ('admin', 'account_manager') THEN c.contract_start_date
    ELSE NULL
  END as contract_start_date,
  CASE 
    WHEN get_user_role(auth.uid()) IN ('admin', 'account_manager') THEN c.contract_end_date
    ELSE NULL
  END as contract_end_date,
  CASE 
    WHEN get_user_role(auth.uid()) IN ('admin', 'account_manager') THEN c.notes
    ELSE NULL
  END as notes
FROM public.clients c;

-- 3. Recreate integrations_secure view with SECURITY INVOKER  
CREATE VIEW public.integrations_secure
WITH (security_invoker = true)
AS
SELECT 
  i.id,
  i.organization_id,
  i.name,
  i.service,
  i.is_active,
  i.last_sync_at,
  i.created_at,
  i.updated_at
  -- config field is intentionally excluded to protect API credentials
FROM public.integrations i;

-- Grant appropriate permissions on views
GRANT SELECT ON public.clients_secure TO authenticated;
GRANT SELECT ON public.integrations_secure TO authenticated;