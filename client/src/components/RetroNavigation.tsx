import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Calendar, MapPin, Gift, Image, HelpCircle, Users, ClipboardCheck } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/story", label: "Our Story", icon: Users },
  { path: "/events", label: "Events", icon: Calendar },
  { path: "/venue", label: "Travel", icon: MapPin },
  { path: "/rsvp", label: "RSVP", icon: ClipboardCheck },
  { path: "/registry", label: "Gifts", icon: Gift },
  { path: "/photos", label: "Photos", icon: Image },
  { path: "/faq", label: "FAQ", icon: HelpCircle },
];

export default function RetroNavigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-primary border-b-4 border-primary-border shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "secondary" : "default"}
                  size="sm"
                  className="retro-button gap-2"
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
