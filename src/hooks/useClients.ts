import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Client, RiskLevel } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { 
  createClientSchema, 
  updateClientSchema, 
  validateInput,
} from '@/lib/validation';

interface CreateClientInput {
  name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contract_value?: number;
  contract_start_date?: string;
  contract_end_date?: string;
  assigned_to?: string;
  notes?: string;
}

interface UpdateClientInput extends Partial<CreateClientInput> {
  id: string;
  health_score?: number;
  risk_level?: RiskLevel;
}

export function useClients() {
  const { organization } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const clientsQuery = useQuery({
    queryKey: ['clients', organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) throw error;
      return data as Client[];
    },
    enabled: !!organization,
  });

  const createClient = useMutation({
    mutationFn: async (input: CreateClientInput) => {
      if (!organization) throw new Error('No organization');
      
      // Validate input before sending to database
      const validation = validateInput(createClientSchema, input);
      if (validation.success === false) {
        throw new Error(validation.error);
      }
      
      // Transform empty strings to null for optional fields
      const cleanedInput = {
        name: validation.data.name,
        contact_name: validation.data.contact_name || null,
        contact_email: validation.data.contact_email || null,
        contact_phone: validation.data.contact_phone || null,
        contract_value: validation.data.contract_value || null,
        contract_start_date: validation.data.contract_start_date || null,
        contract_end_date: validation.data.contract_end_date || null,
        assigned_to: validation.data.assigned_to || null,
        notes: validation.data.notes || null,
        organization_id: organization.id,
      };
      
      const { data, error } = await supabase
        .from('clients')
        .insert(cleanedInput)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Client created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to create client', description: error.message, variant: 'destructive' });
    },
  });

  const updateClient = useMutation({
    mutationFn: async ({ id, ...input }: UpdateClientInput) => {
      // Validate input before sending to database
      const validation = validateInput(updateClientSchema, { id, ...input });
      if (validation.success === false) {
        throw new Error(validation.error);
      }
      
      const { data, error } = await supabase
        .from('clients')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Client updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update client', description: error.message, variant: 'destructive' });
    },
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Client deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete client', description: error.message, variant: 'destructive' });
    },
  });

  return {
    clients: clientsQuery.data ?? [],
    isLoading: clientsQuery.isLoading,
    error: clientsQuery.error,
    createClient,
    updateClient,
    deleteClient,
    refetch: clientsQuery.refetch,
  };
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Client;
    },
    enabled: !!id,
  });
}
