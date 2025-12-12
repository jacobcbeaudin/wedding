'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useSiteAuth } from '@/hooks/use-auth';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const { isAuthenticated, error, isLoading, login } = useSiteAuth();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(password);
    if (!success) {
      setPassword('');
    }
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
              disabled={isLoading}
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
            disabled={isLoading}
            data-testid="button-submit-password"
          >
            {isLoading ? 'Checking...' : 'Enter Site'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
