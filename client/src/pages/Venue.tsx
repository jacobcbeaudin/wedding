import SectionDivider from "@/components/SectionDivider";
import { Card } from "@/components/ui/card";
import { MapPin, Hotel, Plane, Car } from "lucide-react";

export default function Venue() {
  return (
    <div className="py-20 container mx-auto px-6 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="elegant-serif text-5xl md:text-6xl font-light mb-6 text-foreground">
          Travel & Accommodations
        </h1>
        <p className="text-lg text-muted-foreground">Everything you need to know</p>
      </div>

      <SectionDivider />

      <Card className="p-8 mb-12 coastal-shadow border-0">
        <div className="flex items-start gap-4 mb-6">
          <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="elegant-serif text-3xl mb-4 text-primary">Venue</h2>
            <p className="text-xl font-medium mb-2 text-foreground">Hyatt Carmel Highlands</p>
            <p className="text-muted-foreground mb-6">
              120 Highlands Dr, Carmel, CA 93923
            </p>
            <p className="text-foreground leading-relaxed mb-6">
              Nestled in the beautiful hills of Carmel, the Hyatt Highlands offers stunning views 
              of the Pacific Ocean and is the perfect backdrop for our special weekend.
            </p>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden border border-border">
          <iframe
            src="https://www.google.com/maps?q=Hyatt+Carmel+Highlands,+120+Highlands+Dr,+Carmel,+CA+93923&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Hyatt Carmel Highlands Location"
          />
        </div>
      </Card>

      <Card className="p-8 mb-12 coastal-shadow border-0">
        <div className="flex items-start gap-4">
          <Hotel className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="elegant-serif text-3xl mb-6 text-primary">Where to Stay</h2>
            
            <div className="mb-8 p-6 bg-secondary/20 rounded-lg">
              <h3 className="text-xl font-medium mb-4 text-foreground">Hyatt Carmel Highlands</h3>
              <div className="space-y-2 text-foreground">
                <p><span className="font-medium">Room Block Rate:</span> $199/night</p>
                <p><span className="font-medium">Booking Code:</span> BEAUDINZHANG2026</p>
                <p><span className="font-medium">Reservations:</span> (831) 555-0123</p>
                <p><span className="font-medium">Deadline:</span> August 12, 2026</p>
              </div>
              <p className="mt-4 text-muted-foreground">
                We have a special room block at our venue hotel! This is the most convenient option 
                as you'll be steps away from all events. The block includes complimentary breakfast and parking.
              </p>
            </div>

            <h4 className="font-medium mb-4 text-foreground">Alternative Accommodations</h4>
            <ul className="space-y-2 text-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span><strong>La Playa Carmel</strong> - Boutique beachfront hotel, 2 miles away</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span><strong>Carmel Mission Inn</strong> - Budget-friendly option, 3 miles away</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span><strong>Airbnb/VRBO</strong> - Many charming options in downtown Carmel</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8 coastal-shadow border-card-border">
          <div className="flex items-start gap-4">
            <Plane className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="elegant-serif text-2xl mb-4 text-primary">By Air</h3>
              <div className="space-y-4 text-foreground">
                <div>
                  <p className="font-medium">Monterey Regional (MRY)</p>
                  <p className="text-sm text-muted-foreground">12 miles • 20 minutes</p>
                </div>
                <div>
                  <p className="font-medium">San Jose International (SJC)</p>
                  <p className="text-sm text-muted-foreground">75 miles • 1.5 hours</p>
                </div>
                <div>
                  <p className="font-medium">San Francisco (SFO)</p>
                  <p className="text-sm text-muted-foreground">120 miles • 2 hours</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 coastal-shadow border-card-border">
          <div className="flex items-start gap-4">
            <Car className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="elegant-serif text-2xl mb-4 text-primary">By Car</h3>
              <div className="space-y-3 text-foreground">
                <div>
                  <p className="font-medium">From San Francisco</p>
                  <p className="text-sm text-muted-foreground">Highway 1 South (2.5 hrs, scenic)</p>
                </div>
                <div>
                  <p className="font-medium">From Los Angeles</p>
                  <p className="text-sm text-muted-foreground">Highway 101 North (5.5 hrs)</p>
                </div>
                <p className="pt-3 text-sm">
                  <strong>Parking:</strong> Complimentary valet and self-parking at venue
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
