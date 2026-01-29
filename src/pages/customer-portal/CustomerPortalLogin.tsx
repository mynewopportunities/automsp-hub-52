import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCustomerPortal } from '@/contexts/CustomerPortalContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2, Key } from 'lucide-react';
import { useEffect } from 'react';

export default function CustomerPortalLogin() {
  const [searchParams] = useSearchParams();
  const [accessToken, setAccessToken] = useState(searchParams.get('token') || '');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useCustomerPortal();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/customer-portal');
    }
  }, [isAuthenticated, navigate]);

  // Auto-login if token is in URL
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken && !isAuthenticated) {
      handleLogin(urlToken);
    }
  }, [searchParams]);

  const handleLogin = async (tokenToUse?: string) => {
    const token = tokenToUse || accessToken;
    if (!token.trim()) {
      toast({
        title: 'Access token required',
        description: 'Please enter your access token.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const success = await login(token.trim());
    
    if (success) {
      toast({
        title: 'Welcome!',
        description: 'Successfully logged into the customer portal.',
      });
      navigate('/customer-portal');
    } else {
      toast({
        title: 'Invalid access token',
        description: 'The access token is invalid or expired. Please contact your MSP for assistance.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
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
          <CardTitle className="text-2xl">Customer Portal</CardTitle>
          <CardDescription>
            Enter your access token to view and submit support tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Access Token</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="token"
                  type="text"
                  placeholder="Enter your access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="pl-9"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Access Portal'
              )}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Don't have an access token? Contact your IT service provider.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
