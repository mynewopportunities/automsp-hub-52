-- Fix: Allow users to see the organization they just inserted
-- The INSERT policy works, but the SELECT policy blocks the return
-- We need a more permissive SELECT policy for the initial org creation

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their organization" ON public.organizations;

-- Create a more flexible SELECT policy that allows:
-- 1. Members to view their organization (via membership)
-- 2. Users to see orgs they just created (for the INSERT...RETURNING flow)
CREATE POLICY "Users can view their organization" ON public.organizations
FOR SELECT USING (
  is_member_of_org(auth.uid(), id) OR
  -- Allow seeing the org immediately after creation (before membership is added)
  -- by checking if no membership exists yet for this user
  (auth.uid() IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM organization_memberships WHERE user_id = auth.uid()
  ))
);