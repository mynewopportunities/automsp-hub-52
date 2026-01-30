-- Fix RLS on clients_secure view
-- Views with security_invoker = true inherit RLS from the underlying table
-- But we need to ensure the view itself is also protected

-- Drop and recreate clients_secure view with proper security
DROP VIEW IF EXISTS public.clients_secure;

CREATE VIEW public.clients_secure 
WITH (security_invoker = true)
AS
SELECT 
  c.id,
  c.organization_id,
  c.name,
  c.assigned_to,
  c.health_score,
  c.risk_level,
  c.created_at,
  c.updated_at,
  -- Only expose sensitive data to admins and account managers
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
FROM public.clients c
WHERE c.organization_id = get_user_org_id(auth.uid());

-- Drop and recreate integrations_secure view with proper security
DROP VIEW IF EXISTS public.integrations_secure;

CREATE VIEW public.integrations_secure
WITH (security_invoker = true)
AS
SELECT 
  i.id,
  i.organization_id,
  i.service,
  i.name,
  i.is_active,
  i.last_sync_at,
  i.created_at,
  i.updated_at
  -- Note: config column is intentionally excluded as it may contain credentials
FROM public.integrations i
WHERE i.organization_id = get_user_org_id(auth.uid())
  AND is_admin_of_org(auth.uid(), i.organization_id);

-- Grant access to authenticated users
GRANT SELECT ON public.clients_secure TO authenticated;
GRANT SELECT ON public.integrations_secure TO authenticated;