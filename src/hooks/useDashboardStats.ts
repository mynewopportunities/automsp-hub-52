import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { RiskSummary, Client } from '@/types/database';

export function useDashboardStats() {
  const { organization } = useAuth();

  const statsQuery = useQuery({
    queryKey: ['dashboard-stats', organization?.id],
    queryFn: async () => {
      if (!organization) {
        return {
          riskSummary: { low: 0, medium: 0, high: 0, critical: 0, total: 0 },
          portfolioHealth: 0,
          totalClients: 0,
          openTickets: 0,
          overdueTickets: 0,
          recentInteractions: 0,
          atRiskClients: [] as Client[],
        };
      }

      // Fetch all clients for risk breakdown
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', organization.id);

      if (clientsError) throw clientsError;

      // Calculate risk summary
      const riskSummary: RiskSummary = {
        low: clients?.filter(c => c.risk_level === 'low').length ?? 0,
        medium: clients?.filter(c => c.risk_level === 'medium').length ?? 0,
        high: clients?.filter(c => c.risk_level === 'high').length ?? 0,
        critical: clients?.filter(c => c.risk_level === 'critical').length ?? 0,
        total: clients?.length ?? 0,
      };

      // Calculate portfolio health (average health score)
      const totalHealth = clients?.reduce((sum, c) => sum + (c.health_score ?? 50), 0) ?? 0;
      const portfolioHealth = clients?.length ? Math.round(totalHealth / clients.length) : 0;

      // Get at-risk clients (high or critical)
      const atRiskClients = clients
        ?.filter(c => c.risk_level === 'high' || c.risk_level === 'critical')
        .sort((a, b) => {
          const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return riskOrder[a.risk_level as keyof typeof riskOrder] - riskOrder[b.risk_level as keyof typeof riskOrder];
        })
        .slice(0, 5) ?? [];

      // Get open tickets count
      const { count: openTickets } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id)
        .in('status', ['open', 'in_progress']);

      // Get overdue tickets count
      const { count: overdueTickets } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id)
        .in('status', ['open', 'in_progress'])
        .lt('sla_due_date', new Date().toISOString());

      // Get recent interactions (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentInteractions } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id)
        .gte('interaction_date', sevenDaysAgo.toISOString());

      return {
        riskSummary,
        portfolioHealth,
        totalClients: clients?.length ?? 0,
        openTickets: openTickets ?? 0,
        overdueTickets: overdueTickets ?? 0,
        recentInteractions: recentInteractions ?? 0,
        atRiskClients: atRiskClients as Client[],
      };
    },
    enabled: !!organization,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
    error: statsQuery.error,
  };
}
