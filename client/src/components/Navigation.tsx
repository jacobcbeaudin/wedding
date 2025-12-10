import { Link, useLocation } from 'wouter';

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

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location === item.path;

              return (
                <Link key={item.path} href={item.path}>
                  <button
                    className={`text-sm tracking-wide transition-colors ${
                      isActive ? 'font-medium text-primary' : 'text-foreground hover:text-primary'
                    }`}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
