import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Building2, Shield } from 'lucide-react';

export default function Onboarding() {
  const [orgName, setOrgName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createOrganization, isAuthenticated, hasOrganization } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already has organization
  if (hasOrganization) {
    navigate('/');
    return null;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

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
    } else {
      toast({
        title: 'Organization created!',
        description: 'Welcome to AutoMSP.',
      });
      navigate('/');
    }

    setIsLoading(false);
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
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Organization'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
