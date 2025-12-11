'use client';

import CoastalLayout from '@/components/CoastalLayout';
import SectionDivider from '@/components/SectionDivider';
import { Card } from '@/components/ui/card';
import { MapPin, Hotel, Plane, Car } from 'lucide-react';

export default function Venue() {
  return (
    <CoastalLayout>
      <div className="container mx-auto max-w-5xl px-6 py-12 sm:py-20">
        <div className="mb-12 text-center sm:mb-16">
          <h1 className="elegant-serif text-foreground mb-6 text-4xl font-light sm:text-5xl md:text-6xl">
            Travel & Accommodations
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">Everything you need to know</p>
        </div>

        <SectionDivider />

        <Card className="coastal-shadow mb-8 border-0 p-6 sm:mb-12 sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <MapPin className="text-primary mt-1 h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" />
            <div className="flex-1">
              <h2 className="elegant-serif text-primary mb-4 text-2xl sm:text-3xl">Venue</h2>
              <p className="text-foreground mb-2 text-lg font-medium sm:text-xl">
                Hyatt Carmel Highlands
              </p>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                120 Highlands Dr, Carmel, CA 93923
              </p>
              <p className="text-foreground mb-6 text-sm leading-relaxed sm:text-base">
                Nestled in the beautiful hills of Carmel, the Hyatt Highlands offers stunning views
                of the Pacific Ocean and is the perfect backdrop for our special weekend.
              </p>
            </div>
          </div>

          <div className="border-border overflow-hidden rounded-lg border">
            <iframe
              src="https://www.google.com/maps?q=Hyatt+Carmel+Highlands,+120+Highlands+Dr,+Carmel,+CA+93923&output=embed"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hyatt Carmel Highlands Location"
              className="sm:h-[400px]"
            />
          </div>
        </Card>

        <div className="mb-8 sm:mb-12">
          <div className="mb-6 flex items-center justify-center gap-3 sm:mb-8">
            <Hotel className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
            <h2 className="elegant-serif text-primary text-2xl sm:text-3xl">Where to Stay</h2>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <Card className="coastal-shadow border-0 p-6 sm:p-8">
              <h3 className="elegant-serif text-primary mb-2 text-lg sm:text-xl">
                Hyatt Carmel Highlands
              </h3>
              <p className="text-primary/80 mb-4 text-xs font-medium sm:text-sm">Wedding Venue</p>
              <p className="text-muted-foreground mb-4 text-sm">
                Steps away from all wedding events. Stunning ocean views and complimentary parking.
              </p>
              <div className="text-foreground space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">From</span> $199/night
                </p>
                <p className="text-muted-foreground text-xs">Code: BEAUDINZHANG2026</p>
              </div>
            </Card>

            <Card className="coastal-shadow border-0 p-6 sm:p-8">
              <h3 className="elegant-serif text-primary mb-2 text-lg sm:text-xl">
                Monterey Plaza Hotel
              </h3>
              <p className="text-muted-foreground mb-4 text-xs font-medium sm:text-sm">
                15 minutes from venue
              </p>
              <p className="text-muted-foreground mb-4 text-sm">
                Oceanfront luxury on Cannery Row with spa, rooftop dining, and private beach access.
              </p>
              <div className="text-foreground space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">From</span> $350/night
                </p>
              </div>
            </Card>

            <Card className="coastal-shadow border-0 p-6 sm:p-8">
              <h3 className="elegant-serif text-primary mb-2 text-lg sm:text-xl">
                La Playa Carmel
              </h3>
              <p className="text-muted-foreground mb-4 text-xs font-medium sm:text-sm">
                10 minutes from venue
              </p>
              <p className="text-muted-foreground mb-4 text-sm">
                Historic boutique hotel in the heart of Carmel-by-the-Sea with lush gardens.
              </p>
              <div className="text-foreground space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">From</span> $275/night
                </p>
              </div>
            </Card>
          </div>

          <p className="text-muted-foreground mt-6 text-center text-xs sm:mt-8 sm:text-sm">
            Book by August 12, 2026 for best rates. Additional options available on Airbnb and VRBO.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <Card className="coastal-shadow border-0 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Plane className="text-primary mt-1 h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" />
              <div>
                <h3 className="elegant-serif text-primary mb-4 text-xl sm:text-2xl">By Air</h3>
                <div className="text-foreground space-y-3 text-sm sm:space-y-4 sm:text-base">
                  <div>
                    <p className="font-medium">Monterey Regional (MRY)</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      12 miles &bull; 20 minutes
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">San Jose International (SJC)</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      75 miles &bull; 1.5 hours
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">San Francisco (SFO)</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      120 miles &bull; 2 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="coastal-shadow border-0 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Car className="text-primary mt-1 h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" />
              <div>
                <h3 className="elegant-serif text-primary mb-4 text-xl sm:text-2xl">By Car</h3>
                <div className="text-foreground space-y-2 text-sm sm:space-y-3 sm:text-base">
                  <div>
                    <p className="font-medium">From San Francisco</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Highway 1 South (2.5 hrs, scenic)
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">From Los Angeles</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Highway 101 North (5.5 hrs)
                    </p>
                  </div>
                  <p className="pt-2 text-xs sm:pt-3 sm:text-sm">
                    <strong>Parking:</strong> Complimentary valet and self-parking at venue
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </CoastalLayout>
  );
}
