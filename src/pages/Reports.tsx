import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BarChart3, Users, Ticket, TrendingUp } from 'lucide-react';

const reports = [
  {
    id: 'churn-risk',
    name: 'Churn Risk Summary',
    description: 'Monthly overview of client risk levels and trends',
    icon: TrendingUp,
  },
  {
    id: 'client-health',
    name: 'Client Health Trends',
    description: 'Health score changes over the past 30/60/90 days',
    icon: BarChart3,
  },
  {
    id: 'account-manager',
    name: 'Account Manager Performance',
    description: 'Client retention and engagement by account manager',
    icon: Users,
  },
  {
    id: 'sla-compliance',
    name: 'SLA Compliance Report',
    description: 'Ticket response and resolution time metrics',
    icon: Ticket,
  },
];

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground">
          Generate and export reports on client health and team performance
        </p>
      </div>

      {/* Report cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <report.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" disabled>
                  <FileText className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" disabled>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export section */}
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>
            Export your data for external analysis or backup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="justify-start" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export Clients (CSV)
            </Button>
            <Button variant="outline" className="justify-start" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export Interactions (CSV)
            </Button>
            <Button variant="outline" className="justify-start" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export Tickets (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
