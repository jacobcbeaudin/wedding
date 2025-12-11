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
      <div className="bg-background min-h-screen">
        <Navigation />
        {children}
      </div>
    </PasswordProtection>
  );
}
