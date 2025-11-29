import SectionDivider from "@/components/SectionDivider";
import { Card } from "@/components/ui/card";

export default function Events() {
  return (
    <div className="py-20 container mx-auto px-6 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="elegant-serif text-5xl md:text-6xl font-light mb-6 text-foreground">
          Event Schedule
        </h1>
        <p className="text-lg text-muted-foreground">A weekend of celebration</p>
      </div>

      <SectionDivider />

      <div className="space-y-8">
        <Card className="p-8 coastal-shadow border-0">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center md:text-left">
              <div className="text-5xl mb-4">🧧</div>
              <div className="elegant-serif text-3xl text-primary">Tea Ceremony</div>
            </div>
            <div className="md:col-span-3">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="font-medium text-foreground min-w-[120px]">Date & Time:</span>
                  <span className="text-muted-foreground">Thursday, September 11, 2026 at 2:00 PM</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="font-medium text-foreground min-w-[120px]">Location:</span>
                  <span className="text-muted-foreground">Garden Pavilion</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="font-medium text-foreground min-w-[120px]">Dress Code:</span>
                  <span className="text-muted-foreground">Semi-formal / Cocktail attire</span>
                </div>
                <p className="text-foreground pt-4 leading-relaxed">
                  A traditional tea ceremony celebrating the union of our families. 
                  This intimate gathering will honor our heritage and the coming together of two families.
                </p>
                <p className="text-sm text-muted-foreground italic pt-3">
                  This ceremony is reserved for immediate family members.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 coastal-shadow border-card-border">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center md:text-left">
              <div className="text-5xl mb-4">🥂</div>
              <div className="elegant-serif text-3xl text-primary">Welcome Party</div>
            </div>
            <div className="md:col-span-3">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="font-medium text-foreground min-w-[120px]">Date & Time:</span>
                  <span className="text-muted-foreground">Thursday, September 11, 2026 at 7:00 PM</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="font-medium text-foreground min-w-[120px]">Location:</span>
                  <span className="text-muted-foreground">Terrace & Lounge</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="font-medium text-foreground min-w-[120px]">Dress Code:</span>
                  <span className="text-muted-foreground">Casual chic / Resort casual</span>
                </div>
                <p className="text-foreground pt-4 leading-relaxed">
                  Kick off the weekend with drinks, appetizers, and mingling! This is a relaxed 
                  evening to meet other guests and get the party started. Open bar and light bites will be served.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 coastal-shadow border-card-border">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center md:text-left">
              <div className="text-5xl mb-4">💒</div>
              <div className="elegant-serif text-3xl text-primary">Wedding Day</div>
            </div>
            <div className="md:col-span-3">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="font-medium text-foreground min-w-[120px]">Date:</span>
                  <span className="text-muted-foreground">Friday, September 12, 2026</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="font-medium text-foreground min-w-[120px]">Ceremony:</span>
                  <span className="text-muted-foreground">4:00 PM</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="font-medium text-foreground min-w-[120px]">Cocktail Hour:</span>
                  <span className="text-muted-foreground">5:00 PM - 6:00 PM</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="font-medium text-foreground min-w-[120px]">Reception:</span>
                  <span className="text-muted-foreground">6:00 PM - 11:00 PM</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="font-medium text-foreground min-w-[120px]">Location:</span>
                  <span className="text-muted-foreground">Grand Ballroom & Gardens</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <span className="font-medium text-foreground min-w-[120px]">Dress Code:</span>
                  <span className="text-muted-foreground">Formal / Black tie optional</span>
                </div>
                <p className="text-foreground pt-4 leading-relaxed">
                  Join us as we exchange vows in a beautiful outdoor ceremony, followed by cocktails, 
                  dinner, dancing, and celebration. Dinner will be a plated multi-course meal with vegetarian options.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <SectionDivider />

      <Card className="p-8 bg-secondary/30 border-0 mt-12">
        <h2 className="elegant-serif text-2xl mb-6 text-center text-primary">Weekend Timeline</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="font-medium text-foreground">Thursday, Sept 11 • 2:00 PM</span>
            <span className="text-muted-foreground">Tea Ceremony <span className="text-xs italic">(family only)</span></span>
          </div>
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="font-medium text-foreground">Thursday, Sept 11 • 7:00 PM</span>
            <span className="text-muted-foreground">Welcome Party</span>
          </div>
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="font-medium text-foreground">Friday, Sept 12 • 4:00 PM</span>
            <span className="text-muted-foreground">Ceremony</span>
          </div>
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="font-medium text-foreground">Friday, Sept 12 • 5:00 PM</span>
            <span className="text-muted-foreground">Cocktails</span>
          </div>
          <div className="flex justify-between items-center pb-3">
            <span className="font-medium text-foreground">Friday, Sept 12 • 6:00 PM</span>
            <span className="text-muted-foreground">Reception</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
