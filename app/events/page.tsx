'use client';

import Image from 'next/image';
import CoastalLayout from '@/components/CoastalLayout';
import SectionDivider from '@/components/SectionDivider';
import { Card } from '@/components/ui/card';

export default function Events() {
  return (
    <CoastalLayout>
      <div className="container mx-auto max-w-5xl px-6 py-12 sm:py-20">
        <div className="mb-12 text-center sm:mb-16">
          <h1 className="elegant-serif mb-6 text-4xl font-light text-foreground sm:text-5xl md:text-6xl">
            Event Schedule
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">A weekend of celebration</p>
        </div>

        <SectionDivider />

        <div className="space-y-6 sm:space-y-8">
          <Card className="coastal-shadow border-0 p-6 sm:p-8">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-4">
              <div className="text-center md:text-left">
                <Image
                  src="/images/icons/tea-ceremony.png"
                  alt="Tea ceremony"
                  width={112}
                  height={112}
                  className="mx-auto mb-4 h-20 w-20 sm:h-28 sm:w-28 md:mx-0"
                />
                <div className="elegant-serif text-2xl text-primary sm:text-3xl">Tea Ceremony</div>
              </div>
              <div className="md:col-span-3">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <span className="min-w-[120px] font-medium text-foreground">Date & Time:</span>
                    <span className="text-muted-foreground">
                      Thursday, September 11, 2026 at 2:00 PM
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <span className="min-w-[120px] font-medium text-foreground">Location:</span>
                    <span className="text-muted-foreground">Garden Pavilion</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <span className="min-w-[120px] font-medium text-foreground">Dress Code:</span>
                    <span className="text-muted-foreground">Semi-formal / Cocktail attire</span>
                  </div>
                  <p className="pt-3 text-sm leading-relaxed text-foreground sm:pt-4 sm:text-base">
                    A traditional tea ceremony celebrating the union of our families. This intimate
                    gathering will honor our heritage and the coming together of two families.
                  </p>
                  <p className="pt-2 text-xs italic text-muted-foreground sm:pt-3 sm:text-sm">
                    This ceremony is reserved for immediate family members.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="coastal-shadow border-card-border p-6 sm:p-8">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-4">
              <div className="text-center md:text-left">
                <Image
                  src="/images/icons/welcome-party.png"
                  alt="Welcome party"
                  width={112}
                  height={112}
                  className="mx-auto mb-4 h-20 w-20 sm:h-28 sm:w-28 md:mx-0"
                />
                <div className="elegant-serif text-2xl text-primary sm:text-3xl">Welcome Party</div>
              </div>
              <div className="md:col-span-3">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <span className="min-w-[120px] font-medium text-foreground">Date & Time:</span>
                    <span className="text-muted-foreground">
                      Thursday, September 11, 2026 at 7:00 PM
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <span className="min-w-[120px] font-medium text-foreground">Location:</span>
                    <span className="text-muted-foreground">Terrace & Lounge</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <span className="min-w-[120px] font-medium text-foreground">Dress Code:</span>
                    <span className="text-muted-foreground">Casual chic / Resort casual</span>
                  </div>
                  <p className="pt-3 text-sm leading-relaxed text-foreground sm:pt-4 sm:text-base">
                    Kick off the weekend with drinks, appetizers, and mingling! This is a relaxed
                    evening to meet other guests and get the party started. Open bar and light bites
                    will be served.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="coastal-shadow border-card-border p-6 sm:p-8">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-4">
              <div className="text-center md:text-left">
                <Image
                  src="/images/icons/wedding.png"
                  alt="Wedding"
                  width={112}
                  height={112}
                  className="mx-auto mb-4 h-20 w-20 sm:h-28 sm:w-28 md:mx-0"
                />
                <div className="elegant-serif text-2xl text-primary sm:text-3xl">Wedding Day</div>
              </div>
              <div className="md:col-span-3">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <span className="min-w-[120px] font-medium text-foreground">Date:</span>
                    <span className="text-muted-foreground">Friday, September 12, 2026</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <span className="min-w-[120px] font-medium text-foreground">Ceremony:</span>
                    <span className="text-muted-foreground">4:00 PM</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <span className="min-w-[120px] font-medium text-foreground">
                      Cocktail Hour:
                    </span>
                    <span className="text-muted-foreground">5:00 PM - 6:00 PM</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <span className="min-w-[120px] font-medium text-foreground">Reception:</span>
                    <span className="text-muted-foreground">6:00 PM - 11:00 PM</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <span className="min-w-[120px] font-medium text-foreground">Location:</span>
                    <span className="text-muted-foreground">Grand Ballroom & Gardens</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <span className="min-w-[120px] font-medium text-foreground">Dress Code:</span>
                    <span className="text-muted-foreground">Formal / Black tie optional</span>
                  </div>
                  <p className="pt-3 text-sm leading-relaxed text-foreground sm:pt-4 sm:text-base">
                    Join us as we exchange vows in a beautiful outdoor ceremony, followed by
                    cocktails, dinner, dancing, and celebration. Dinner will be a plated
                    multi-course meal with vegetarian options.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <SectionDivider />

        <Card className="mt-8 border-0 bg-secondary/30 p-6 sm:mt-12 sm:p-8">
          <h2 className="elegant-serif mb-4 text-center text-xl text-primary sm:mb-6 sm:text-2xl">
            Weekend Timeline
          </h2>
          <div className="space-y-3 text-sm sm:space-y-4 sm:text-base">
            <div className="flex flex-col items-start justify-between border-b border-border pb-3 sm:flex-row sm:items-center">
              <span className="font-medium text-foreground">Thursday, Sept 11 &bull; 2:00 PM</span>
              <span className="text-muted-foreground">
                Tea Ceremony <span className="text-xs italic">(family only)</span>
              </span>
            </div>
            <div className="flex flex-col items-start justify-between border-b border-border pb-3 sm:flex-row sm:items-center">
              <span className="font-medium text-foreground">Thursday, Sept 11 &bull; 7:00 PM</span>
              <span className="text-muted-foreground">Welcome Party</span>
            </div>
            <div className="flex flex-col items-start justify-between border-b border-border pb-3 sm:flex-row sm:items-center">
              <span className="font-medium text-foreground">Friday, Sept 12 &bull; 4:00 PM</span>
              <span className="text-muted-foreground">Ceremony</span>
            </div>
            <div className="flex flex-col items-start justify-between border-b border-border pb-3 sm:flex-row sm:items-center">
              <span className="font-medium text-foreground">Friday, Sept 12 &bull; 5:00 PM</span>
              <span className="text-muted-foreground">Cocktails</span>
            </div>
            <div className="flex flex-col items-start justify-between pb-3 sm:flex-row sm:items-center">
              <span className="font-medium text-foreground">Friday, Sept 12 &bull; 6:00 PM</span>
              <span className="text-muted-foreground">Reception</span>
            </div>
          </div>
        </Card>
      </div>
    </CoastalLayout>
  );
}
