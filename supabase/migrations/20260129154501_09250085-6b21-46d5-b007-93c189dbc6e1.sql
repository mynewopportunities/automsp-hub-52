-- Create customer portal tokens table for client access
CREATE TABLE public.customer_portal_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create index for faster token lookups
CREATE INDEX idx_customer_portal_tokens_hash ON public.customer_portal_tokens(token_hash);
CREATE INDEX idx_customer_portal_tokens_client ON public.customer_portal_tokens(client_id);

-- Enable RLS
ALTER TABLE public.customer_portal_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Organization admins can manage portal tokens
CREATE POLICY "Admins can manage portal tokens"
ON public.customer_portal_tokens
FOR ALL
USING (
  public.is_admin_of_org(auth.uid(), organization_id)
);

-- Policy: Account managers can view portal tokens for their assigned clients
CREATE POLICY "Account managers can view their client tokens"
ON public.customer_portal_tokens
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.clients c
    JOIN public.organization_memberships om ON c.organization_id = om.organization_id
    WHERE c.id = client_id
      AND om.user_id = auth.uid()
      AND (om.role = 'admin' OR (om.role = 'account_manager' AND c.assigned_to = auth.uid()))
  )
);

-- Add customer_submitted column to tickets for tracking portal submissions
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS customer_submitted BOOLEAN DEFAULT false;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS customer_email TEXT;