import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import photo1 from '@assets/generated_images/couple_engagement_photo_1.png';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('wedding_authenticated') === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${photo1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card className="coastal-shadow w-full max-w-md border-0 bg-background/95 p-10 text-center backdrop-blur-sm">
        <div className="mb-8">
          <h1 className="elegant-serif mb-4 text-5xl tracking-wide text-primary">
            Caroline & Jake
          </h1>
          <p className="elegant-serif text-xl text-muted-foreground">September 12, 2026</p>
        </div>

        <div className="mb-8">
          <p className="mb-2 text-foreground">Welcome to our wedding website!</p>
          <p className="text-sm text-muted-foreground">
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
              <p className="mt-2 text-sm text-destructive" data-testid="text-password-error">
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

        <p className="mt-8 text-xs text-muted-foreground">
          Having trouble? Contact Jake or Caroline directly.
        </p>
      </Card>
    </div>
  );
}
