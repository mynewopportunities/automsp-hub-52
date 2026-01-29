import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link2, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

const integrations = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Sync contacts, companies, and deal information',
    icon: '🔶',
    features: ['Contact sync', 'Company sync', 'Deal tracking', 'Email history'],
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    description: 'Import incidents, tickets, and SLA metrics',
    icon: '🟢',
    features: ['Incident sync', 'Ticket data', 'SLA metrics', 'Response times'],
  },
  {
    id: 'connectwise',
    name: 'ConnectWise',
    description: 'Sync service tickets and agreement data',
    icon: '🔵',
    features: ['Service tickets', 'Agreements', 'Billing data', 'Usage metrics'],
  },
  {
    id: 'custom',
    name: 'Custom API',
    description: 'Configure a custom integration with any tool',
    icon: '⚙️',
    features: ['Custom endpoints', 'Field mapping', 'Scheduled sync'],
  },
];

export default function Integrations() {
  const { role } = useAuth();

  const isAdmin = role === 'admin';

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your tools to automatically sync client data
        </p>
      </div>

      {!isAdmin && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">
            Only administrators can configure integrations. Contact your admin to set up new connections.
          </p>
        </div>
      )}

      {/* Integration cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <CardTitle>{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-muted-foreground">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not connected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {integration.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              {isAdmin ? (
                <Button className="w-full" disabled>
                  <Link2 className="h-4 w-4 mr-2" />
                  Connect {integration.name}
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
