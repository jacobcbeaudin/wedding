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
import {
  Users,
  UserCheck,
  UsersRound,
  CheckCircle2,
  Music,
  LogOut,
  Lock,
  CalendarDays,
  Mail,
  PartyPopper,
} from 'lucide-react';

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
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md border-0 p-8 shadow-lg">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold">Admin Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your password to access the dashboard
            </p>
          </div>
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
                className="mt-1"
              />
            </div>
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
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
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <PartyPopper className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-lg font-semibold">Wedding Admin</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <DashboardStats adminToken={adminToken} />

        <Tabs defaultValue="parties" className="mt-6">
          <TabsList className="mb-4 h-auto flex-wrap">
            <TabsTrigger value="parties" className="gap-2">
              <Users className="h-4 w-4" />
              <span>Parties</span>
            </TabsTrigger>
            <TabsTrigger value="guests" className="gap-2">
              <UsersRound className="h-4 w-4" />
              <span>Guests</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger value="rsvps" className="gap-2">
              <Mail className="h-4 w-4" />
              <span>RSVPs</span>
            </TabsTrigger>
            <TabsTrigger value="songs" className="gap-2">
              <Music className="h-4 w-4" />
              <span>Songs</span>
            </TabsTrigger>
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
  const { data: stats, isLoading } = trpc.admin.getDashboardStats.useQuery({ adminToken });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="h-24 animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const responseRate =
    stats.totalParties > 0 ? Math.round((stats.partiesResponded / stats.totalParties) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
      <StatCard
        label="Parties"
        value={stats.totalParties}
        icon={<Users className="h-5 w-5" />}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-600"
      />
      <StatCard
        label="Response Rate"
        value={`${responseRate}%`}
        subtitle={`${stats.partiesResponded} of ${stats.totalParties} responded`}
        icon={<UserCheck className="h-5 w-5" />}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-600"
      />
      <StatCard
        label="Total Guests"
        value={stats.totalGuests}
        icon={<UsersRound className="h-5 w-5" />}
        iconBg="bg-purple-500/10"
        iconColor="text-purple-600"
      />
      <StatCard
        label="Attending"
        value={stats.attendingCount}
        subtitle={`${stats.declinedCount} declined`}
        icon={<CheckCircle2 className="h-5 w-5" />}
        iconBg="bg-green-500/10"
        iconColor="text-green-600"
      />
      <StatCard
        label="Song Requests"
        value={stats.songRequestCount}
        icon={<Music className="h-5 w-5" />}
        iconBg="bg-pink-500/10"
        iconColor="text-pink-600"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Card className="border-0 p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`rounded-lg p-2 ${iconBg} ${iconColor}`}>{icon}</div>
      </div>
    </Card>
  );
}
