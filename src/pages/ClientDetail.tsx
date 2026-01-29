import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useClient, useClients } from '@/hooks/useClients';
import { useInteractions } from '@/hooks/useInteractions';
import { useTickets } from '@/hooks/useTickets';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  MessageSquare,
  Ticket,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { InteractionType, Sentiment } from '@/types/database';
import { CustomerPortalTokenGenerator } from '@/components/clients/CustomerPortalTokenGenerator';

const riskBadgeVariants = {
  low: 'bg-risk-low/10 text-risk-low border-risk-low/20',
  medium: 'bg-risk-medium/10 text-risk-medium border-risk-medium/20',
  high: 'bg-risk-high/10 text-risk-high border-risk-high/20',
  critical: 'bg-risk-critical/10 text-risk-critical border-risk-critical/20',
};

const sentimentColors = {
  positive: 'text-health-excellent',
  neutral: 'text-muted-foreground',
  negative: 'text-destructive',
};

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: client, isLoading } = useClient(id);
  const { deleteClient } = useClients();
  const { interactions, createInteraction } = useInteractions(id);
  const { tickets, createTicket } = useTickets(id);
  const { role } = useAuth();

  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [interactionForm, setInteractionForm] = useState({
    type: 'call' as InteractionType,
    subject: '',
    details: '',
    sentiment: 'neutral' as Sentiment,
  });
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'medium',
  });

  const canEdit = role === 'admin' || role === 'account_manager';

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium">Client not found</h2>
        <Button asChild className="mt-4">
          <Link to="/clients">Back to Clients</Link>
        </Button>
      </div>
    );
  }

  const handleCreateInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInteraction.mutateAsync({
      client_id: client.id,
      type: interactionForm.type,
      subject: interactionForm.subject || undefined,
      details: interactionForm.details || undefined,
      sentiment: interactionForm.sentiment,
    });
    setInteractionForm({ type: 'call', subject: '', details: '', sentiment: 'neutral' });
    setIsInteractionDialogOpen(false);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTicket.mutateAsync({
      client_id: client.id,
      subject: ticketForm.subject,
      description: ticketForm.description || undefined,
      priority: ticketForm.priority as any,
    });
    setTicketForm({ subject: '', description: '', priority: 'medium' });
    setIsTicketDialogOpen(false);
  };

  const handleDelete = async () => {
    await deleteClient.mutateAsync(client.id);
    navigate('/clients');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{client.name}</h1>
              <Badge
                variant="outline"
                className={cn(
                  'capitalize',
                  riskBadgeVariants[client.risk_level as keyof typeof riskBadgeVariants]
                )}
              >
                {client.risk_level} risk
              </Badge>
            </div>
            <p className="text-muted-foreground">Health Score: {client.health_score}%</p>
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            <CustomerPortalTokenGenerator
              clientId={client.id}
              clientName={client.name}
              contactEmail={client.contact_email || undefined}
              contactName={client.contact_name || undefined}
            />
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Client</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {client.name}? This will also delete all
                    associated interactions and tickets. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Client info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Contact Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {client.contact_name && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Name:</span>
                <span>{client.contact_name}</span>
              </div>
            )}
            {client.contact_email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <a href={`mailto:${client.contact_email}`} className="text-primary hover:underline">
                  {client.contact_email}
                </a>
              </div>
            )}
            {client.contact_phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span>{client.contact_phone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Contract
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {client.contract_value && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Value:</span>
                <span className="font-medium">${client.contract_value.toLocaleString()}</span>
              </div>
            )}
            {client.contract_start_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>Start: {format(new Date(client.contract_start_date), 'MMM d, yyyy')}</span>
              </div>
            )}
            {client.contract_end_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>End: {format(new Date(client.contract_end_date), 'MMM d, yyyy')}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(client.health_score / 100) * 226} 226`}
                    className={cn(
                      client.health_score >= 80
                        ? 'text-health-excellent'
                        : client.health_score >= 60
                        ? 'text-health-good'
                        : client.health_score >= 40
                        ? 'text-health-fair'
                        : 'text-health-poor'
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{client.health_score}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {client.health_score >= 80
                  ? 'Excellent health'
                  : client.health_score >= 60
                  ? 'Good health'
                  : client.health_score >= 40
                  ? 'Fair health'
                  : 'Needs attention'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {client.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs for interactions and tickets */}
      <Tabs defaultValue="interactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="interactions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Interactions ({interactions.length})
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Tickets ({tickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interactions" className="space-y-4">
          <div className="flex justify-end">
            {canEdit && (
              <Dialog open={isInteractionDialogOpen} onOpenChange={setIsInteractionDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Interaction
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleCreateInteraction}>
                    <DialogHeader>
                      <DialogTitle>Log Interaction</DialogTitle>
                      <DialogDescription>
                        Record a new interaction with {client.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={interactionForm.type}
                            onValueChange={(v) =>
                              setInteractionForm({ ...interactionForm, type: v as InteractionType })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="call">Call</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="meeting">Meeting</SelectItem>
                              <SelectItem value="note">Note</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Sentiment</Label>
                          <Select
                            value={interactionForm.sentiment}
                            onValueChange={(v) =>
                              setInteractionForm({ ...interactionForm, sentiment: v as Sentiment })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="positive">Positive</SelectItem>
                              <SelectItem value="neutral">Neutral</SelectItem>
                              <SelectItem value="negative">Negative</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input
                          value={interactionForm.subject}
                          onChange={(e) =>
                            setInteractionForm({ ...interactionForm, subject: e.target.value })
                          }
                          placeholder="Brief summary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Details</Label>
                        <Textarea
                          value={interactionForm.details}
                          onChange={(e) =>
                            setInteractionForm({ ...interactionForm, details: e.target.value })
                          }
                          placeholder="Describe the interaction..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsInteractionDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createInteraction.isPending}>
                        {createInteraction.isPending ? 'Saving...' : 'Save'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {interactions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No interactions recorded yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {interactions.map((interaction: any) => (
                <Card key={interaction.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {interaction.type}
                          </Badge>
                          {interaction.sentiment && (
                            <span
                              className={cn(
                                'text-sm capitalize',
                                sentimentColors[interaction.sentiment as keyof typeof sentimentColors]
                              )}
                            >
                              {interaction.sentiment}
                            </span>
                          )}
                        </div>
                        {interaction.subject && (
                          <p className="font-medium">{interaction.subject}</p>
                        )}
                        {interaction.details && (
                          <p className="text-sm text-muted-foreground">{interaction.details}</p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(interaction.interaction_date), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex justify-end">
            {canEdit && (
              <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleCreateTicket}>
                    <DialogHeader>
                      <DialogTitle>Create Ticket</DialogTitle>
                      <DialogDescription>
                        Open a new support ticket for {client.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Subject *</Label>
                        <Input
                          value={ticketForm.subject}
                          onChange={(e) =>
                            setTicketForm({ ...ticketForm, subject: e.target.value })
                          }
                          placeholder="Ticket subject"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select
                          value={ticketForm.priority}
                          onValueChange={(v) =>
                            setTicketForm({ ...ticketForm, priority: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={ticketForm.description}
                          onChange={(e) =>
                            setTicketForm({ ...ticketForm, description: e.target.value })
                          }
                          placeholder="Describe the issue..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsTicketDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createTicket.isPending}>
                        {createTicket.isPending ? 'Creating...' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {tickets.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Ticket className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No tickets recorded yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket: any) => (
                <Card key={ticket.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              'capitalize',
                              ticket.status === 'open'
                                ? 'border-risk-medium text-risk-medium'
                                : ticket.status === 'in_progress'
                                ? 'border-primary text-primary'
                                : 'border-health-excellent text-health-excellent'
                            )}
                          >
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              'capitalize',
                              riskBadgeVariants[ticket.priority as keyof typeof riskBadgeVariants]
                            )}
                          >
                            {ticket.priority}
                          </Badge>
                        </div>
                        <p className="font-medium">{ticket.subject}</p>
                        {ticket.description && (
                          <p className="text-sm text-muted-foreground">{ticket.description}</p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
