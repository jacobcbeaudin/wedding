import { ReactNode } from "react";

interface CoastalLayoutProps {
  children: ReactNode;
}

export default function CoastalLayout({ children }: CoastalLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
