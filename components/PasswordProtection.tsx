'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { trpc } from '@/components/providers/trpc-provider';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check sessionStorage after mount to avoid hydration mismatch
    const authenticated = sessionStorage.getItem('wedding_authenticated') === 'true';
    setIsAuthenticated(authenticated);
  }, []);

  const verifyMutation = trpc.auth.verify.useMutation({
    onSuccess: () => {
      sessionStorage.setItem('wedding_authenticated', 'true');
      setIsAuthenticated(true);
    },
    onError: (err) => {
      if (err.data?.code === 'TOO_MANY_REQUESTS') {
        setError('Too many attempts. Please wait a moment and try again.');
      } else {
        setError('Incorrect password. Please check your invitation.');
      }
      setPassword('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    verifyMutation.mutate({ password });
  };

  // Show nothing while checking auth status
  if (isAuthenticated === null) {
    return null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        backgroundImage: `url(/images/photo-05.webp)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card className="coastal-shadow bg-background/95 w-full max-w-md border-0 p-10 text-center backdrop-blur-sm">
        <div className="mb-8">
          <h1 className="elegant-serif text-primary mb-4 text-5xl tracking-wide">
            Caroline & Jake
          </h1>
        </div>

        <div className="mb-8">
          <p className="text-foreground mb-2">Welcome to our wedding website!</p>
          <p className="text-muted-foreground text-sm">
            Please enter the password from your invitation to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center text-lg"
              disabled={verifyMutation.isPending}
              data-testid="input-password"
            />
            {error && (
              <p className="text-destructive mt-2 text-sm" data-testid="text-password-error">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={verifyMutation.isPending}
            data-testid="button-submit-password"
          >
            {verifyMutation.isPending ? 'Checking...' : 'Enter Site'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
