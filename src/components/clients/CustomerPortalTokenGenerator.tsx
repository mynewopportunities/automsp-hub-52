import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Loader2, Copy, Check, Key } from 'lucide-react';

interface CustomerPortalTokenGeneratorProps {
  clientId: string;
  clientName: string;
  contactEmail?: string;
  contactName?: string;
}

export function CustomerPortalTokenGenerator({
  clientId,
  clientName,
  contactEmail,
  contactName,
}: CustomerPortalTokenGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(contactEmail || '');
  const [name, setName] = useState(contactName || '');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address for the portal access.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-portal-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.session?.access_token}`,
          },
          body: JSON.stringify({
            client_id: clientId,
            email,
            name: name || undefined,
            expires_days: 365,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGeneratedUrl(data.portal_url);
          toast({
            title: 'Portal access created!',
            description: 'Copy the link below and share it with your customer.',
          });
        } else {
          throw new Error(data.error || 'Failed to generate token');
        }
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate token');
      }
    } catch (error) {
      console.error('Error generating token:', error);
      toast({
        title: 'Failed to generate access',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied!',
      description: 'Portal link copied to clipboard.',
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setGeneratedUrl('');
    setEmail(contactEmail || '');
    setName(contactName || '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? setIsOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Key className="h-4 w-4 mr-2" />
          Customer Portal Access
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Portal Access</DialogTitle>
          <DialogDescription>
            Create a secure access link for {clientName} to view and submit support tickets.
          </DialogDescription>
        </DialogHeader>

        {!generatedUrl ? (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="portal-email">Customer Email *</Label>
              <Input
                id="portal-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@company.com"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portal-name">Customer Name</Label>
              <Input
                id="portal-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                disabled={isLoading}
              />
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Portal Access Link</p>
              <div className="flex items-center gap-2">
                <Input
                  value={generatedUrl}
                  readOnly
                  className="text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>• This link is valid for 1 year</p>
              <p>• The customer can use it to submit and track tickets</p>
              <p>• Generating a new link will invalidate the previous one</p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(generatedUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Test Portal Link
            </Button>
          </div>
        )}

        <DialogFooter>
          {!generatedUrl ? (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={isLoading || !email}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Access'
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
