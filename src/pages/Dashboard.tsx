import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  Users,
  Ticket,
  MessageSquare,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const riskColors = {
  low: 'bg-risk-low',
  medium: 'bg-risk-medium',
  high: 'bg-risk-high',
  critical: 'bg-risk-critical',
};

const riskBadgeVariants = {
  low: 'bg-risk-low/10 text-risk-low border-risk-low/20',
  medium: 'bg-risk-medium/10 text-risk-medium border-risk-medium/20',
  high: 'bg-risk-high/10 text-risk-high border-risk-high/20',
  critical: 'bg-risk-critical/10 text-risk-critical border-risk-critical/20',
};

export default function Dashboard() {
  const { organization } = useAuth();
  const { stats, isLoading } = useDashboardStats();

  if (isLoading || !stats) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-health-excellent';
    if (score >= 60) return 'text-health-good';
    if (score >= 40) return 'text-health-fair';
    if (score >= 20) return 'text-health-poor';
    return 'text-health-critical';
  };

  const getHealthProgressColor = (score: number) => {
    if (score >= 80) return 'bg-health-excellent';
    if (score >= 60) return 'bg-health-good';
    if (score >= 40) return 'bg-health-fair';
    if (score >= 20) return 'bg-health-poor';
    return 'bg-health-critical';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to {organization?.name}
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.riskSummary.high + stats.riskSummary.critical} at risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Health</CardTitle>
            {stats.portfolioHealth >= 50 ? (
              <TrendingUp className="h-4 w-4 text-health-good" />
            ) : (
              <TrendingDown className="h-4 w-4 text-health-poor" />
            )}
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', getHealthColor(stats.portfolioHealth))}>
              {stats.portfolioHealth}%
            </div>
            <Progress
              value={stats.portfolioHealth}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            {stats.overdueTickets > 0 && (
              <p className="text-xs text-destructive">
                {stats.overdueTickets} overdue
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentInteractions}</div>
            <p className="text-xs text-muted-foreground">
              interactions this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk breakdown and at-risk clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Breakdown</CardTitle>
            <CardDescription>Client distribution by risk level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(['critical', 'high', 'medium', 'low'] as const).map((level) => (
              <div key={level} className="flex items-center gap-3">
                <div className={cn('w-3 h-3 rounded-full', riskColors[level])} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{level}</span>
                    <span className="font-medium">{stats.riskSummary[level]}</span>
                  </div>
                  <Progress
                    value={
                      stats.riskSummary.total > 0
                        ? (stats.riskSummary[level] / stats.riskSummary.total) * 100
                        : 0
                    }
                    className="h-1.5 mt-1"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* At-risk clients */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-risk-high" />
                At-Risk Clients
              </CardTitle>
              <CardDescription>Clients requiring immediate attention</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/clients?filter=at-risk">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.atRiskClients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No clients at high or critical risk</p>
                <p className="text-sm">Great job maintaining client health!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.atRiskClients.map((client) => (
                  <Link
                    key={client.id}
                    to={`/clients/${client.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{client.name}</div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'capitalize',
                          riskBadgeVariants[client.risk_level as keyof typeof riskBadgeVariants]
                        )}
                      >
                        {client.risk_level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Health: {client.health_score}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
