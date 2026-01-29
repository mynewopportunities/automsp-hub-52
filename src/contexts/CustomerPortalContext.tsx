import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface CustomerPortalClient {
  id: string;
  name: string;
  organization_id: string;
}

interface CustomerPortalContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  client: CustomerPortalClient | null;
  customerEmail: string | null;
  customerName: string | null;
  token: string | null;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
}

const CustomerPortalContext = createContext<CustomerPortalContextType | undefined>(undefined);

const PORTAL_TOKEN_KEY = 'automsp_customer_portal_token';

export function CustomerPortalProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<CustomerPortalClient | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(PORTAL_TOKEN_KEY);
    if (storedToken) {
      validateToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/customer-portal/validate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenToValidate }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          setClient(data.client);
          setCustomerEmail(data.email);
          setCustomerName(data.name);
          setToken(tokenToValidate);
          localStorage.setItem(PORTAL_TOKEN_KEY, tokenToValidate);
        } else {
          localStorage.removeItem(PORTAL_TOKEN_KEY);
        }
      } else {
        localStorage.removeItem(PORTAL_TOKEN_KEY);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem(PORTAL_TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/customer-portal/validate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: newToken }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          setClient(data.client);
          setCustomerEmail(data.email);
          setCustomerName(data.name);
          setToken(newToken);
          localStorage.setItem(PORTAL_TOKEN_KEY, newToken);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(PORTAL_TOKEN_KEY);
    setClient(null);
    setCustomerEmail(null);
    setCustomerName(null);
    setToken(null);
  };

  return (
    <CustomerPortalContext.Provider
      value={{
        isAuthenticated: !!client,
        isLoading,
        client,
        customerEmail,
        customerName,
        token,
        login,
        logout,
      }}
    >
      {children}
    </CustomerPortalContext.Provider>
  );
}

export function useCustomerPortal() {
  const context = useContext(CustomerPortalContext);
  if (!context) {
    throw new Error('useCustomerPortal must be used within CustomerPortalProvider');
  }
  return context;
}
