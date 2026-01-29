import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Interaction, InteractionType, Sentiment } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

interface CreateInteractionInput {
  client_id: string;
  type: InteractionType;
  subject?: string;
  details?: string;
  sentiment?: Sentiment;
  interaction_date?: string;
}

export function useInteractions(clientId?: string) {
  const { organization, user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const interactionsQuery = useQuery({
    queryKey: ['interactions', organization?.id, clientId],
    queryFn: async () => {
      if (!organization) return [];
      
      let query = supabase
        .from('interactions')
        .select('*, profiles:created_by(id, email, full_name), clients(id, name)')
        .eq('organization_id', organization.id)
        .order('interaction_date', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!organization,
  });

  const createInteraction = useMutation({
    mutationFn: async (input: CreateInteractionInput) => {
      if (!organization || !user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('interactions')
        .insert({
          ...input,
          organization_id: organization.id,
          created_by: user.id,
          interaction_date: input.interaction_date || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions'] });
      toast({ title: 'Interaction logged successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to log interaction', description: error.message, variant: 'destructive' });
    },
  });

  const deleteInteraction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('interactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions'] });
      toast({ title: 'Interaction deleted' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete interaction', description: error.message, variant: 'destructive' });
    },
  });

  return {
    interactions: interactionsQuery.data ?? [],
    isLoading: interactionsQuery.isLoading,
    error: interactionsQuery.error,
    createInteraction,
    deleteInteraction,
  };
}
