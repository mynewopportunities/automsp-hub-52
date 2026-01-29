import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { TicketStatus, TicketPriority } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { 
  createTicketSchema, 
  updateTicketSchema, 
  validateInput,
} from '@/lib/validation';

interface CreateTicketInput {
  client_id: string;
  subject: string;
  description?: string;
  priority?: TicketPriority;
  sla_due_date?: string;
  assigned_to?: string;
}

interface UpdateTicketInput {
  id: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigned_to?: string;
  resolved_at?: string;
}

export function useTickets(clientId?: string) {
  const { organization, user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const ticketsQuery = useQuery({
    queryKey: ['tickets', organization?.id, clientId],
    queryFn: async () => {
      if (!organization) return [];
      
      let query = supabase
        .from('tickets')
        .select('*, clients(id, name), creator:created_by(id, email, full_name), assignee:assigned_to(id, email, full_name)')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!organization,
  });

  const createTicket = useMutation({
    mutationFn: async (input: CreateTicketInput) => {
      if (!organization || !user) throw new Error('Not authenticated');
      
      // Validate input before sending to database
      const validation = validateInput(createTicketSchema, input);
      if (validation.success === false) {
        throw new Error(validation.error);
      }
      
      const insertData = {
        client_id: validation.data.client_id,
        subject: validation.data.subject,
        description: validation.data.description || null,
        priority: validation.data.priority || null,
        sla_due_date: validation.data.sla_due_date || null,
        assigned_to: validation.data.assigned_to || null,
        organization_id: organization.id,
        created_by: user.id,
      };

      const { data, error } = await supabase
        .from('tickets')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({ title: 'Ticket created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to create ticket', description: error.message, variant: 'destructive' });
    },
  });

  const updateTicket = useMutation({
    mutationFn: async ({ id, ...input }: UpdateTicketInput) => {
      // Validate input before sending to database
      const validation = validateInput(updateTicketSchema, { id, ...input });
      if (validation.success === false) {
        throw new Error(validation.error);
      }
      
      const { data, error } = await supabase
        .from('tickets')
        .update({
          ...input,
          ...(input.status === 'resolved' && !input.resolved_at ? { resolved_at: new Date().toISOString() } : {}),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({ title: 'Ticket updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update ticket', description: error.message, variant: 'destructive' });
    },
  });

  const deleteTicket = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({ title: 'Ticket deleted' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete ticket', description: error.message, variant: 'destructive' });
    },
  });

  return {
    tickets: ticketsQuery.data ?? [],
    isLoading: ticketsQuery.isLoading,
    error: ticketsQuery.error,
    createTicket,
    updateTicket,
    deleteTicket,
  };
}
