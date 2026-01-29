import { useCustomerPortal } from '@/contexts/CustomerPortalContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Ticket, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TicketSummary {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

export default function CustomerPortalDashboard() {
  const { client, customerName, token } = useCustomerPortal();
  const [summary, setSummary] = useState<TicketSummary>({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTicketSummary();
  }, [token]);

  const fetchTicketSummary = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/customer-portal/tickets`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        }
      );

      if (response.ok) {
        const { tickets } = await response.json();
        setSummary({
          total: tickets.length,
          open: tickets.filter((t: any) => t.status === 'open').length,
          inProgress: tickets.filter((t: any) => t.status === 'in_progress').length,
          resolved: tickets.filter((t: any) => t.status === 'resolved' || t.status === 'closed').length,
        });
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome, {customerName || 'Customer'}
        </h1>
        <p className="text-muted-foreground">
          Manage your support requests for {client?.name}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Submit New Ticket
            </CardTitle>
            <CardDescription>
              Need help? Create a new support request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/customer-portal/tickets/new">Create Ticket</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              View All Tickets
            </CardTitle>
            <CardDescription>
              Check the status of your support requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/customer-portal/tickets">View Tickets</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Summary */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Ticket Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Ticket className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? '-' : summary.total}</p>
                  <p className="text-xs text-muted-foreground">Total Tickets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? '-' : summary.open}</p>
                  <p className="text-xs text-muted-foreground">Open</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? '-' : summary.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? '-' : summary.resolved}</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
