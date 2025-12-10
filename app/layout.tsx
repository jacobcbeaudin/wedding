import type { Metadata, Viewport } from 'next';
import { TRPCProvider } from '@/components/providers/trpc-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Forum&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <TRPCProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
