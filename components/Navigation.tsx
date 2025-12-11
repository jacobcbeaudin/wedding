'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/story', label: 'Our Story' },
  { path: '/events', label: 'Events' },
  { path: '/venue', label: 'Travel' },
  { path: '/rsvp', label: 'RSVP' },
  { path: '/registry', label: 'Registry' },
  { path: '/photos', label: 'Gallery' },
  { path: '/faq', label: 'FAQ' },
];

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: { path: string; label: string };
  pathname: string;
  onClick?: () => void;
}) {
  const isActive = pathname === item.path;
  return (
    <Link
      href={item.path}
      onClick={onClick}
      className={`text-sm tracking-wide transition-colors ${
        isActive ? 'font-medium text-primary' : 'text-foreground hover:text-primary'
      }`}
      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {item.label}
    </Link>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Filter out Home from nav items since logo serves as home link
  const desktopNavItems = navItems.filter((item) => item.path !== '/');

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo - links to home */}
          <Link
            href="/"
            className="elegant-serif text-xl tracking-wide text-primary transition-opacity hover:opacity-80"
          >
            C & J
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {desktopNavItems.map((item) => (
              <NavLink key={item.path} item={item} pathname={pathname} />
            ))}
          </div>

          {/* Mobile Hamburger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                data-testid="mobile-menu-button"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="elegant-serif text-2xl text-primary">
                  Caroline & Jake
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-6">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    item={item}
                    pathname={pathname}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
