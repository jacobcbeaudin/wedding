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
      <div className="min-h-screen bg-background">
        <Navigation />
        {children}
      </div>
    </PasswordProtection>
  );
}
