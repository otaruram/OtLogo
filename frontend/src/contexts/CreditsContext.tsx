import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface CreditsContextType {
  credits: number | null;
  isLoading: boolean;
  error: string | null;
  fetchCredits: () => void;
  updateCredits: (newCredits: number) => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    if (status === 'authenticated') {
      setIsLoading(true);
      try {
        const response = await fetch('/api/user/credits');
        if (!response.ok) {
          throw new Error('Failed to fetch credits');
        }
        const data = await response.json();
        setCredits(data.credits);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
        setCredits(null);
        setIsLoading(false);
    }
  }, [status]);

  const updateCredits = (newCredits: number) => {
      setCredits(newCredits);
  }

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return (
    <CreditsContext.Provider value={{ credits, isLoading, error, fetchCredits, updateCredits }}>
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
}; 