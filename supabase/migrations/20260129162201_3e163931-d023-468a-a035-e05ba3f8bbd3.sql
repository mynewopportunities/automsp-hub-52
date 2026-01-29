-- ==================================================
-- SECURITY FIX: Role-based client data access
-- ==================================================

-- 1. Create a secure view for clients that restricts sensitive data based on role
-- Admins and Account Managers see all fields, Viewers see limited fields
CREATE OR REPLACE VIEW public.clients_secure AS
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
FROM public.clients c
WHERE c.organization_id = get_user_org_id(auth.uid());

-- 2. Create a secure view for integrations that hides config field
-- Only expose metadata, not the actual config with credentials
CREATE OR REPLACE VIEW public.integrations_secure AS
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
FROM public.integrations i
WHERE is_admin_of_org(auth.uid(), i.organization_id);

-- 3. Fix SECURITY DEFINER functions with deterministic ORDER BY
-- Update get_user_org_id to have deterministic ordering
CREATE OR REPLACE FUNCTION public.get_user_org_id(user_uuid uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id 
  FROM public.organization_memberships 
  WHERE user_id = user_uuid 
  ORDER BY created_at ASC 
  LIMIT 1
$$;

-- Update get_user_role to have deterministic ordering
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role 
  FROM public.organization_memberships 
  WHERE user_id = user_uuid 
  ORDER BY created_at ASC 
  LIMIT 1
$$;

-- 4. Add default expiration for customer portal tokens
-- Update the table to set a default expiration of 365 days for new tokens
ALTER TABLE public.customer_portal_tokens 
  ALTER COLUMN expires_at SET DEFAULT (now() + interval '365 days');

-- 5. Create a function to clean up expired tokens (can be called periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_tokens()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.customer_portal_tokens
  WHERE expires_at IS NOT NULL 
    AND expires_at < now() - interval '30 days'
    AND is_active = false;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- 6. Add check constraints for data validation at database level
-- Validate email format
ALTER TABLE public.clients 
  ADD CONSTRAINT clients_contact_email_format 
  CHECK (contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Validate subject/description lengths
ALTER TABLE public.tickets
  ADD CONSTRAINT tickets_subject_length 
  CHECK (length(subject) <= 500);

ALTER TABLE public.tickets
  ADD CONSTRAINT tickets_description_length 
  CHECK (description IS NULL OR length(description) <= 10000);

ALTER TABLE public.interactions
  ADD CONSTRAINT interactions_subject_length 
  CHECK (subject IS NULL OR length(subject) <= 500);

ALTER TABLE public.interactions
  ADD CONSTRAINT interactions_details_length 
  CHECK (details IS NULL OR length(details) <= 10000);

-- Validate client name length
ALTER TABLE public.clients
  ADD CONSTRAINT clients_name_length 
  CHECK (length(name) <= 200);

-- Validate contract value is positive
ALTER TABLE public.clients
  ADD CONSTRAINT clients_contract_value_positive 
  CHECK (contract_value IS NULL OR contract_value >= 0);

-- Validate contract dates are logical
ALTER TABLE public.clients
  ADD CONSTRAINT clients_contract_dates_valid 
  CHECK (
    contract_start_date IS NULL 
    OR contract_end_date IS NULL 
    OR contract_end_date >= contract_start_date
  );