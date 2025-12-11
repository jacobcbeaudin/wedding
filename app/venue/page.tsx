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
          <h1 className="elegant-serif mb-6 text-4xl font-light text-foreground sm:text-5xl md:text-6xl">
            Travel & Accommodations
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">Everything you need to know</p>
        </div>

        <SectionDivider />

        <Card className="coastal-shadow mb-8 border-0 p-6 sm:mb-12 sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-primary sm:h-6 sm:w-6" />
            <div className="flex-1">
              <h2 className="elegant-serif mb-4 text-2xl text-primary sm:text-3xl">Venue</h2>
              <p className="mb-2 text-lg font-medium text-foreground sm:text-xl">
                Hyatt Carmel Highlands
              </p>
              <p className="mb-6 text-sm text-muted-foreground sm:text-base">
                120 Highlands Dr, Carmel, CA 93923
              </p>
              <p className="mb-6 text-sm leading-relaxed text-foreground sm:text-base">
                Nestled in the beautiful hills of Carmel, the Hyatt Highlands offers stunning views
                of the Pacific Ocean and is the perfect backdrop for our special weekend.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
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

        <Card className="coastal-shadow mb-8 border-0 p-6 sm:mb-12 sm:p-8">
          <div className="flex items-start gap-4">
            <Hotel className="mt-1 h-5 w-5 flex-shrink-0 text-primary sm:h-6 sm:w-6" />
            <div className="flex-1">
              <h2 className="elegant-serif mb-6 text-2xl text-primary sm:text-3xl">
                Where to Stay
              </h2>

              <div className="mb-6 rounded-lg bg-secondary/20 p-4 sm:mb-8 sm:p-6">
                <h3 className="mb-4 text-lg font-medium text-foreground sm:text-xl">
                  Hyatt Carmel Highlands
                </h3>
                <div className="space-y-2 text-sm text-foreground sm:text-base">
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
                <p className="mt-4 text-xs text-muted-foreground sm:text-sm">
                  We have a special room block at our venue hotel! This is the most convenient
                  option as you&apos;ll be steps away from all events. The block includes
                  complimentary breakfast and parking.
                </p>
              </div>

              <h4 className="mb-4 text-sm font-medium text-foreground sm:text-base">
                Alternative Accommodations
              </h4>
              <ul className="space-y-2 text-sm text-foreground sm:text-base">
                <li className="flex gap-2">
                  <span className="text-primary">&bull;</span>
                  <span>
                    <strong>La Playa Carmel</strong> - Boutique beachfront hotel, 2 miles away
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">&bull;</span>
                  <span>
                    <strong>Carmel Mission Inn</strong> - Budget-friendly option, 3 miles away
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">&bull;</span>
                  <span>
                    <strong>Airbnb/VRBO</strong> - Many charming options in downtown Carmel
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <Card className="coastal-shadow border-0 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Plane className="mt-1 h-5 w-5 flex-shrink-0 text-primary sm:h-6 sm:w-6" />
              <div>
                <h3 className="elegant-serif mb-4 text-xl text-primary sm:text-2xl">By Air</h3>
                <div className="space-y-3 text-sm text-foreground sm:space-y-4 sm:text-base">
                  <div>
                    <p className="font-medium">Monterey Regional (MRY)</p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      12 miles &bull; 20 minutes
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">San Jose International (SJC)</p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      75 miles &bull; 1.5 hours
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">San Francisco (SFO)</p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      120 miles &bull; 2 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="coastal-shadow border-0 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Car className="mt-1 h-5 w-5 flex-shrink-0 text-primary sm:h-6 sm:w-6" />
              <div>
                <h3 className="elegant-serif mb-4 text-xl text-primary sm:text-2xl">By Car</h3>
                <div className="space-y-2 text-sm text-foreground sm:space-y-3 sm:text-base">
                  <div>
                    <p className="font-medium">From San Francisco</p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      Highway 1 South (2.5 hrs, scenic)
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">From Los Angeles</p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
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
