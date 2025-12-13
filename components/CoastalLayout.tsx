'use client';

import { ReactNode } from 'react';
import Navigation from './Navigation';
import PasswordProtection from './PasswordProtection';

interface CoastalLayoutProps {
  children: ReactNode;
}

export default function CoastalLayout({ children }: CoastalLayoutProps) {
  return (
    <PasswordProtection>
      <div className="bg-background flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <footer className="py-6 text-center">
          <a
            href="https://github.com/jacobcbeaudin/wedding"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/50 hover:text-muted-foreground font-mono text-xs transition-colors"
          >
            &lt;!-- over-engineered by the groom --&gt;
          </a>
        </footer>
      </div>
    </PasswordProtection>
  );
}
