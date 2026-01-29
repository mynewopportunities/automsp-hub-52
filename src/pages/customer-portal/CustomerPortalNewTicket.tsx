import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerPortal } from '@/contexts/CustomerPortalContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomerPortalNewTicket() {
  const { token, client } = useCustomerPortal();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim()) {
      toast({
        title: 'Subject required',
        description: 'Please enter a subject for your ticket.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/customer-portal/submit-ticket`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            subject: subject.trim(),
            description: description.trim() || null,
            priority,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: 'Ticket submitted!',
            description: 'Your support request has been received. We\'ll be in touch soon.',
          });
          navigate('/customer-portal/tickets');
        } else {
          throw new Error(data.error || 'Failed to submit ticket');
        }
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit ticket');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/customer-portal/tickets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Submit New Ticket</h1>
          <p className="text-muted-foreground">Describe your issue and we'll help you resolve it</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
          <CardDescription>
            Submitting for {client?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Brief description of the issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - General question or minor issue</SelectItem>
                  <SelectItem value="medium">Medium - Issue affecting work</SelectItem>
                  <SelectItem value="high">High - Urgent issue affecting productivity</SelectItem>
                  <SelectItem value="critical">Critical - Complete work stoppage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide more details about the issue, including any error messages, when it started, and steps to reproduce..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Ticket'
                )}
              </Button>
              <Button type="button" variant="outline" asChild disabled={isLoading}>
                <Link to="/customer-portal/tickets">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
