import SectionDivider from '@/components/SectionDivider';
import { Card } from '@/components/ui/card';

export default function Events() {
  return (
    <div className="container mx-auto max-w-5xl px-6 py-20">
      <div className="mb-16 text-center">
        <h1 className="elegant-serif mb-6 text-5xl font-light text-foreground md:text-6xl">
          Event Schedule
        </h1>
        <p className="text-lg text-muted-foreground">A weekend of celebration</p>
      </div>

      <SectionDivider />

      <div className="space-y-8">
        <Card className="coastal-shadow border-0 p-8">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center md:text-left">
              <div className="mb-4 text-5xl">🧧</div>
              <div className="elegant-serif text-3xl text-primary">Tea Ceremony</div>
            </div>
            <div className="md:col-span-3">
              <div className="space-y-3">
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
                <p className="pt-4 leading-relaxed text-foreground">
                  A traditional tea ceremony celebrating the union of our families. This intimate
                  gathering will honor our heritage and the coming together of two families.
                </p>
                <p className="pt-3 text-sm italic text-muted-foreground">
                  This ceremony is reserved for immediate family members.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="coastal-shadow border-card-border p-8">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center md:text-left">
              <div className="mb-4 text-5xl">🥂</div>
              <div className="elegant-serif text-3xl text-primary">Welcome Party</div>
            </div>
            <div className="md:col-span-3">
              <div className="space-y-3">
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
                <p className="pt-4 leading-relaxed text-foreground">
                  Kick off the weekend with drinks, appetizers, and mingling! This is a relaxed
                  evening to meet other guests and get the party started. Open bar and light bites
                  will be served.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="coastal-shadow border-card-border p-8">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center md:text-left">
              <div className="mb-4 text-5xl">💒</div>
              <div className="elegant-serif text-3xl text-primary">Wedding Day</div>
            </div>
            <div className="md:col-span-3">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="min-w-[120px] font-medium text-foreground">Date:</span>
                  <span className="text-muted-foreground">Friday, September 12, 2026</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="min-w-[120px] font-medium text-foreground">Ceremony:</span>
                  <span className="text-muted-foreground">4:00 PM</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="min-w-[120px] font-medium text-foreground">Cocktail Hour:</span>
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
                <p className="pt-4 leading-relaxed text-foreground">
                  Join us as we exchange vows in a beautiful outdoor ceremony, followed by
                  cocktails, dinner, dancing, and celebration. Dinner will be a plated multi-course
                  meal with vegetarian options.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <SectionDivider />

      <Card className="mt-12 border-0 bg-secondary/30 p-8">
        <h2 className="elegant-serif mb-6 text-center text-2xl text-primary">Weekend Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-medium text-foreground">Thursday, Sept 11 • 2:00 PM</span>
            <span className="text-muted-foreground">
              Tea Ceremony <span className="text-xs italic">(family only)</span>
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-medium text-foreground">Thursday, Sept 11 • 7:00 PM</span>
            <span className="text-muted-foreground">Welcome Party</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-medium text-foreground">Friday, Sept 12 • 4:00 PM</span>
            <span className="text-muted-foreground">Ceremony</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-medium text-foreground">Friday, Sept 12 • 5:00 PM</span>
            <span className="text-muted-foreground">Cocktails</span>
          </div>
          <div className="flex items-center justify-between pb-3">
            <span className="font-medium text-foreground">Friday, Sept 12 • 6:00 PM</span>
            <span className="text-muted-foreground">Reception</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
