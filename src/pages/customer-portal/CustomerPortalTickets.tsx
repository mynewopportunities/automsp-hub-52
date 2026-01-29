import { useCustomerPortal } from '@/contexts/CustomerPortalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Ticket {
  id: string;
  subject: string;
  description: string | null;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  sla_due_date: string | null;
  resolved_at: string | null;
}

const statusConfig = {
  open: { label: 'Open', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
  resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  closed: { label: 'Closed', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' },
};

const priorityConfig = {
  low: { label: 'Low', className: 'border-gray-300 text-gray-600' },
  medium: { label: 'Medium', className: 'border-blue-300 text-blue-600' },
  high: { label: 'High', className: 'border-orange-300 text-orange-600' },
  critical: { label: 'Critical', className: 'border-red-300 text-red-600' },
};

export default function CustomerPortalTickets() {
  const { token } = useCustomerPortal();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const fetchTickets = async () => {
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
        const data = await response.json();
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Tickets</h1>
          <p className="text-muted-foreground">View and track your support requests</p>
        </div>
        <Button asChild>
          <Link to="/customer-portal/tickets/new">
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Link>
        </Button>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You don't have any support tickets yet.</p>
            <Button asChild>
              <Link to="/customer-portal/tickets/new">Create Your First Ticket</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-base">{ticket.subject}</CardTitle>
                    {ticket.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ticket.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      className={cn(
                        'border-0',
                        statusConfig[ticket.status as keyof typeof statusConfig]?.className
                      )}
                    >
                      {statusConfig[ticket.status as keyof typeof statusConfig]?.label || ticket.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        priorityConfig[ticket.priority as keyof typeof priorityConfig]?.className
                      )}
                    >
                      {priorityConfig[ticket.priority as keyof typeof priorityConfig]?.label || ticket.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</span>
                  {ticket.resolved_at && (
                    <span>• Resolved {formatDistanceToNow(new Date(ticket.resolved_at), { addSuffix: true })}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
