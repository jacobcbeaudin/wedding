'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/components/providers/trpc-provider';
import { PartiesTab } from './tabs/parties';
import { GuestsTab } from './tabs/guests';
import { EventsTab } from './tabs/events';
import { RsvpsTab } from './tabs/rsvps';
import { SongsTab } from './tabs/songs';

const ADMIN_TOKEN_KEY = 'admin_token';

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (stored) {
      setAdminToken(stored);
    }
  }, []);

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      localStorage.setItem(ADMIN_TOKEN_KEY, password);
      setAdminToken(password);
      setPassword('');
      setError('');
    },
    onError: (err) => {
      setError(err.message || 'Invalid password');
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ password });
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminToken(null);
  };

  // Login screen
  if (!adminToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-6">
          <h1 className="mb-6 text-center text-2xl font-semibold">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={loginMutation.isPending}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={!password || loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold">Wedding Admin</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <DashboardStats adminToken={adminToken} />

        <Tabs defaultValue="parties" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="parties">Parties</TabsTrigger>
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
            <TabsTrigger value="songs">Songs</TabsTrigger>
          </TabsList>

          <TabsContent value="parties">
            <PartiesTab adminToken={adminToken} />
          </TabsContent>
          <TabsContent value="guests">
            <GuestsTab adminToken={adminToken} />
          </TabsContent>
          <TabsContent value="events">
            <EventsTab adminToken={adminToken} />
          </TabsContent>
          <TabsContent value="rsvps">
            <RsvpsTab adminToken={adminToken} />
          </TabsContent>
          <TabsContent value="songs">
            <SongsTab adminToken={adminToken} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function DashboardStats({ adminToken }: { adminToken: string }) {
  const { data: stats } = trpc.admin.getDashboardStats.useQuery({ adminToken });

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
      <StatCard label="Parties" value={stats.totalParties} />
      <StatCard label="Responded" value={`${stats.partiesResponded}/${stats.totalParties}`} />
      <StatCard label="Guests" value={stats.totalGuests} />
      <StatCard
        label="Attending"
        value={stats.attendingCount}
        subtitle={`${stats.declinedCount} declined`}
      />
      <StatCard label="Song Requests" value={stats.songRequestCount} />
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </Card>
  );
}
