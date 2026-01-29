import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { AppRole } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export function useMembers() {
  const { organization } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const membersQuery = useQuery({
    queryKey: ['members', organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      
      const { data, error } = await supabase
        .from('organization_memberships')
        .select('*, profiles:user_id(id, email, full_name, avatar_url)')
        .eq('organization_id', organization.id)
        .order('created_at');

      if (error) throw error;
      return data;
    },
    enabled: !!organization,
  });

  // Role checks removed - RLS policies enforce authorization server-side
  // Client-side role checks provide false security and can be bypassed
  const updateMemberRole = useMutation({
    mutationFn: async ({ membershipId, newRole }: { membershipId: string; newRole: AppRole }) => {
      const { data, error } = await supabase
        .from('organization_memberships')
        .update({ role: newRole })
        .eq('id', membershipId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({ title: 'Member role updated' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update role', description: error.message, variant: 'destructive' });
    },
  });

  // Role checks removed - RLS policies enforce authorization server-side
  const removeMember = useMutation({
    mutationFn: async (membershipId: string) => {
      const { error } = await supabase
        .from('organization_memberships')
        .delete()
        .eq('id', membershipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({ title: 'Member removed' });
    },
    onError: (error) => {
      toast({ title: 'Failed to remove member', description: error.message, variant: 'destructive' });
    },
  });

  return {
    members: membersQuery.data ?? [],
    isLoading: membersQuery.isLoading,
    error: membersQuery.error,
    updateMemberRole,
    removeMember,
  };
}
