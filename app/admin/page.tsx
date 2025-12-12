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
  Heart,
  Sparkles,
  Users2,
  CircleCheck,
  Music2,
  LogOut,
  KeyRound,
  Calendar,
  Send,
  Gem,
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
      <div
        className="flex min-h-screen items-center justify-center p-4"
        style={{
          backgroundImage: `url(/images/photo-05.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Card className="bg-background/95 w-full max-w-md border-0 p-8 shadow-lg backdrop-blur-sm">
          <div className="mb-6 flex flex-col items-center">
            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <KeyRound className="text-primary h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold">Admin Login</h1>
            <p className="text-muted-foreground mt-1 text-sm">
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
              <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
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
    <div className="bg-muted/30 min-h-screen">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <Gem className="text-primary h-4 w-4" />
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
              <Heart className="h-4 w-4" />
              <span>Parties</span>
            </TabsTrigger>
            <TabsTrigger value="guests" className="gap-2">
              <Users2 className="h-4 w-4" />
              <span>Guests</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger value="rsvps" className="gap-2">
              <Send className="h-4 w-4" />
              <span>RSVPs</span>
            </TabsTrigger>
            <TabsTrigger value="songs" className="gap-2">
              <Music2 className="h-4 w-4" />
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
          <Card key={i} className="bg-muted/50 h-24 animate-pulse" />
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
        icon={<Heart className="h-5 w-5" />}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-600"
      />
      <StatCard
        label="Response Rate"
        value={`${responseRate}%`}
        subtitle={`${stats.partiesResponded} of ${stats.totalParties} responded`}
        icon={<Sparkles className="h-5 w-5" />}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-600"
      />
      <StatCard
        label="Total Guests"
        value={stats.totalGuests}
        icon={<Users2 className="h-5 w-5" />}
        iconBg="bg-purple-500/10"
        iconColor="text-purple-600"
      />
      <StatCard
        label="Attending"
        value={stats.attendingCount}
        subtitle={`${stats.declinedCount} declined`}
        icon={<CircleCheck className="h-5 w-5" />}
        iconBg="bg-green-500/10"
        iconColor="text-green-600"
      />
      <StatCard
        label="Song Requests"
        value={stats.songRequestCount}
        icon={<Music2 className="h-5 w-5" />}
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
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          {subtitle && <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>}
        </div>
        <div className={`rounded-lg p-2 ${iconBg} ${iconColor}`}>{icon}</div>
      </div>
    </Card>
  );
}
