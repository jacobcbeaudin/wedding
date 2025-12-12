import type { Metadata, Viewport } from 'next';
import { Forum, Great_Vibes } from 'next/font/google';
import { TRPCProvider } from '@/components/providers/trpc-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

// Optimized font loading - self-hosted, no layout shift
const forum = Forum({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-forum',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-great-vibes',
});

export const metadata: Metadata = {
  title: "Caroline & Jake's Wedding - September 12, 2026",
  description:
    'Join us in celebrating the wedding of Jake Beaudin and Caroline Zhang on September 12, 2026 at Hyatt Carmel Highlands. RSVP for tea ceremony, welcome party, and wedding ceremony.',
  openGraph: {
    title: "Caroline & Jake's Wedding - September 12, 2026",
    description:
      'Join us in celebrating the wedding of Jake Beaudin and Caroline Zhang on September 12, 2026 at Hyatt Carmel Highlands.',
  },
  icons: {
    icon: '/favicon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${forum.variable} ${greatVibes.variable}`}>
      <body>
        <TRPCProvider>
          <TooltipProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
            <Toaster />
            <Analytics />
          </TooltipProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
