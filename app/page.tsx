'use client';

import Link from 'next/link';
import CoastalLayout from '@/components/CoastalLayout';
import CountdownTimer from '@/components/CountdownTimer';
import SectionDivider from '@/components/SectionDivider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <CoastalLayout>
      <div>
        <section
          className="relative flex h-[90vh] items-center justify-center text-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(/images/photo-01.webp)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="fade-in-up relative z-10 px-4 text-white">
            <h1 className="elegant-serif mb-6 text-5xl tracking-wide sm:text-6xl md:text-7xl">
              Caroline & Jake
            </h1>
            <div className="elegant-serif mb-4 text-xl font-light sm:text-2xl md:text-3xl">
              September 12, 2026
            </div>
            <div className="text-base tracking-wide sm:text-lg md:text-xl">
              Hyatt Carmel Highlands &bull; Carmel, California
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-4xl px-6 py-12 sm:py-20">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="elegant-serif mb-6 text-3xl font-light text-foreground sm:text-4xl md:text-5xl">
              Join Us in Celebrating Our Love
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We are thrilled to invite you to share in the joy of our wedding weekend. Your
              presence would mean the world to us as we begin this beautiful journey together.
            </p>
          </div>

          <SectionDivider />

          <div className="mb-12 sm:mb-16">
            <CountdownTimer />
          </div>

          <SectionDivider />

          <div className="mb-12 grid gap-4 sm:mb-16 sm:gap-6 md:grid-cols-3">
            <Card className="coastal-shadow border-0 p-6 text-center sm:p-8">
              <div className="mb-4 text-3xl sm:text-4xl">&#129511;</div>
              <h3 className="elegant-serif mb-2 text-xl text-primary sm:text-2xl">Tea Ceremony</h3>
              <p className="mb-2 text-sm text-muted-foreground sm:text-base">September 11, 2026</p>
              <p className="mb-2 text-xs sm:text-sm">2:00 PM</p>
              <p className="text-xs italic text-muted-foreground">Immediate family only</p>
            </Card>

            <Card className="coastal-shadow border-0 p-6 text-center sm:p-8">
              <div className="mb-4 text-3xl sm:text-4xl">&#129346;</div>
              <h3 className="elegant-serif mb-2 text-xl text-primary sm:text-2xl">Welcome Party</h3>
              <p className="mb-2 text-sm text-muted-foreground sm:text-base">September 11, 2026</p>
              <p className="text-xs sm:text-sm">7:00 PM</p>
            </Card>

            <Card className="coastal-shadow border-0 p-6 text-center sm:p-8">
              <div className="mb-4 text-3xl sm:text-4xl">&#128210;</div>
              <h3 className="elegant-serif mb-2 text-xl text-primary sm:text-2xl">
                Wedding Ceremony
              </h3>
              <p className="mb-2 text-sm text-muted-foreground sm:text-base">September 12, 2026</p>
              <p className="text-xs sm:text-sm">4:00 PM</p>
            </Card>
          </div>

          <div className="space-y-4 text-center sm:space-y-6">
            <Link href="/rsvp">
              <Button
                size="lg"
                className="w-full px-12 text-base tracking-wide sm:w-auto"
                data-testid="button-rsvp-home"
              >
                RSVP NOW
              </Button>
            </Link>

            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/events">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full px-8 sm:w-auto"
                  data-testid="button-events-home"
                >
                  View Full Schedule
                </Button>
              </Link>
              <Link href="/venue">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full px-8 sm:w-auto"
                  data-testid="button-venue-home"
                >
                  Travel Information
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </CoastalLayout>
  );
}
