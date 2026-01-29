import { Outlet, Navigate } from 'react-router-dom';
import { useCustomerPortal } from '@/contexts/CustomerPortalContext';
import { Shield, Loader2, LogOut, Ticket, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function CustomerPortalLayout() {
  const { isLoading, isAuthenticated, client, customerName, logout } = useCustomerPortal();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/customer-portal/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <span className="font-bold text-foreground">AutoMSP</span>
              <span className="text-muted-foreground ml-2">Customer Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{customerName || 'Customer'}</p>
              <p className="text-xs text-muted-foreground">{client?.name}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <NavLink
              to="/customer-portal"
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )
              }
            >
              <Home className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/customer-portal/tickets"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )
              }
            >
              <Ticket className="h-4 w-4" />
              My Tickets
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
