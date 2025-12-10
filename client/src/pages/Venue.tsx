import SectionDivider from '@/components/SectionDivider';
import { Card } from '@/components/ui/card';
import { MapPin, Hotel, Plane, Car } from 'lucide-react';

export default function Venue() {
  return (
    <div className="container mx-auto max-w-5xl px-6 py-20">
      <div className="mb-16 text-center">
        <h1 className="elegant-serif mb-6 text-5xl font-light text-foreground md:text-6xl">
          Travel & Accommodations
        </h1>
        <p className="text-lg text-muted-foreground">Everything you need to know</p>
      </div>

      <SectionDivider />

      <Card className="coastal-shadow mb-12 border-0 p-8">
        <div className="mb-6 flex items-start gap-4">
          <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
          <div className="flex-1">
            <h2 className="elegant-serif mb-4 text-3xl text-primary">Venue</h2>
            <p className="mb-2 text-xl font-medium text-foreground">Hyatt Carmel Highlands</p>
            <p className="mb-6 text-muted-foreground">120 Highlands Dr, Carmel, CA 93923</p>
            <p className="mb-6 leading-relaxed text-foreground">
              Nestled in the beautiful hills of Carmel, the Hyatt Highlands offers stunning views of
              the Pacific Ocean and is the perfect backdrop for our special weekend.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
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

      <Card className="coastal-shadow mb-12 border-0 p-8">
        <div className="flex items-start gap-4">
          <Hotel className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
          <div className="flex-1">
            <h2 className="elegant-serif mb-6 text-3xl text-primary">Where to Stay</h2>

            <div className="mb-8 rounded-lg bg-secondary/20 p-6">
              <h3 className="mb-4 text-xl font-medium text-foreground">Hyatt Carmel Highlands</h3>
              <div className="space-y-2 text-foreground">
                <p>
                  <span className="font-medium">Room Block Rate:</span> $199/night
                </p>
                <p>
                  <span className="font-medium">Booking Code:</span> BEAUDINZHANG2026
                </p>
                <p>
                  <span className="font-medium">Reservations:</span> (831) 555-0123
                </p>
                <p>
                  <span className="font-medium">Deadline:</span> August 12, 2026
                </p>
              </div>
              <p className="mt-4 text-muted-foreground">
                We have a special room block at our venue hotel! This is the most convenient option
                as you'll be steps away from all events. The block includes complimentary breakfast
                and parking.
              </p>
            </div>

            <h4 className="mb-4 font-medium text-foreground">Alternative Accommodations</h4>
            <ul className="space-y-2 text-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  <strong>La Playa Carmel</strong> - Boutique beachfront hotel, 2 miles away
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  <strong>Carmel Mission Inn</strong> - Budget-friendly option, 3 miles away
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  <strong>Airbnb/VRBO</strong> - Many charming options in downtown Carmel
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="coastal-shadow border-card-border p-8">
          <div className="flex items-start gap-4">
            <Plane className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
            <div>
              <h3 className="elegant-serif mb-4 text-2xl text-primary">By Air</h3>
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

        <Card className="coastal-shadow border-card-border p-8">
          <div className="flex items-start gap-4">
            <Car className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
            <div>
              <h3 className="elegant-serif mb-4 text-2xl text-primary">By Car</h3>
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
