import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Building2, Shield, Loader2, Database, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';

export default function Onboarding() {
  const [orgName, setOrgName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [seedDemoData, setSeedDemoData] = useState(true);
  const [seedingStatus, setSeedingStatus] = useState<'idle' | 'seeding' | 'done'>('idle');
  const { createOrganization, isAuthenticated, hasOrganization, refreshUserData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already has organization
  if (hasOrganization) {
    navigate('/portal');
    return null;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const seedDemoDataToOrg = async () => {
    setSeedingStatus('seeding');
    try {
      const { data: session } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-demo-data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.session?.access_token}`,
          },
        }
      );
      
      const result = await response.json();
      if (result.seeded) {
        toast({
          title: 'Demo data added!',
          description: `Added ${result.counts.clients} clients, ${result.counts.tickets} tickets, and ${result.counts.interactions} interactions.`,
        });
      }
      setSeedingStatus('done');
    } catch (error) {
      console.error('Error seeding demo data:', error);
      toast({
        title: 'Note',
        description: 'Organization created, but demo data seeding failed.',
        variant: 'destructive',
      });
      setSeedingStatus('done');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await createOrganization(orgName);

    if (error) {
      toast({
        title: 'Failed to create organization',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: 'Organization created!',
      description: seedDemoData ? 'Adding demo data...' : 'Welcome to AutoMSP.',
    });

    if (seedDemoData) {
      await seedDemoDataToOrg();
    }

    await refreshUserData();
    setIsLoading(false);
    navigate('/portal');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">AutoMSP</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Set up your organization</CardTitle>
          <CardDescription>
            Enter your company name to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="orgName"
                  type="text"
                  placeholder="Acme MSP Services"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="pl-9"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
              <Checkbox
                id="seedDemo"
                checked={seedDemoData}
                onCheckedChange={(checked) => setSeedDemoData(checked === true)}
                disabled={isLoading}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="seedDemo"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <Database className="h-4 w-4 text-primary" />
                  Add demo data
                </label>
                <p className="text-xs text-muted-foreground">
                  Populate with sample clients, tickets, and interactions
                </p>
              </div>
            </div>

            {seedingStatus === 'seeding' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Seeding demo data...
              </div>
            )}
            
            {seedingStatus === 'done' && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <CheckCircle className="h-4 w-4" />
                Demo data added successfully!
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {seedingStatus === 'seeding' ? 'Adding demo data...' : 'Creating...'}
                </>
              ) : (
                'Create Organization'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
