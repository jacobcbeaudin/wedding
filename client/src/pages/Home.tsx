import CountdownTimer from "@/components/CountdownTimer";
import SectionDivider from "@/components/SectionDivider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import photo1 from "@assets/generated_images/couple_engagement_photo_1.png";

export default function Home() {
  return (
    <div>
      <section 
        className="relative h-[90vh] flex items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${photo1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 text-white fade-in-up px-4">
          <h1 className="elegant-serif text-6xl md:text-7xl mb-6 tracking-wide">
            Caroline & Jake
          </h1>
          <div className="elegant-serif text-2xl md:text-3xl font-light mb-4">
            September 12, 2026
          </div>
          <div className="text-lg md:text-xl tracking-wide">
            Hyatt Carmel Highlands • Carmel, California
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="elegant-serif text-4xl md:text-5xl font-light mb-6 text-foreground">
            Join Us in Celebrating Our Love
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We are thrilled to invite you to share in the joy of our wedding weekend. 
            Your presence would mean the world to us as we begin this beautiful journey together.
          </p>
        </div>

        <SectionDivider />

        <div className="mb-16">
          <CountdownTimer />
        </div>

        <SectionDivider />

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-8 text-center coastal-shadow border-0">
            <div className="text-4xl mb-4">🧧</div>
            <h3 className="elegant-serif text-2xl mb-2 text-primary">Tea Ceremony</h3>
            <p className="text-muted-foreground mb-2">September 11, 2026</p>
            <p className="text-sm mb-2">2:00 PM</p>
            <p className="text-xs text-muted-foreground italic">Immediate family only</p>
          </Card>

          <Card className="p-8 text-center coastal-shadow border-0">
            <div className="text-4xl mb-4">🥂</div>
            <h3 className="elegant-serif text-2xl mb-2 text-primary">Welcome Party</h3>
            <p className="text-muted-foreground mb-2">September 11, 2026</p>
            <p className="text-sm">7:00 PM</p>
          </Card>

          <Card className="p-8 text-center coastal-shadow border-0">
            <div className="text-4xl mb-4">💒</div>
            <h3 className="elegant-serif text-2xl mb-2 text-primary">Wedding Ceremony</h3>
            <p className="text-muted-foreground mb-2">September 12, 2026</p>
            <p className="text-sm">4:00 PM</p>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <Link href="/rsvp">
            <Button 
              size="lg" 
              className="px-12 text-base tracking-wide"
              data-testid="button-rsvp-home"
            >
              RSVP NOW
            </Button>
          </Link>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/events">
              <Button 
                variant="outline" 
                size="lg"
                className="px-8"
                data-testid="button-events-home"
              >
                View Full Schedule
              </Button>
            </Link>
            <Link href="/venue">
              <Button 
                variant="outline" 
                size="lg"
                className="px-8"
                data-testid="button-venue-home"
              >
                Travel Information
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
