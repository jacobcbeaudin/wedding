import CountdownTimer from '@/components/CountdownTimer';
import SectionDivider from '@/components/SectionDivider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import photo1 from '@assets/generated_images/couple_engagement_photo_1.png';

export default function Home() {
  return (
    <div>
      <section
        className="relative flex h-[90vh] items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${photo1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="fade-in-up relative z-10 px-4 text-white">
          <h1 className="elegant-serif mb-6 text-6xl tracking-wide md:text-7xl">Caroline & Jake</h1>
          <div className="elegant-serif mb-4 text-2xl font-light md:text-3xl">
            September 12, 2026
          </div>
          <div className="text-lg tracking-wide md:text-xl">
            Hyatt Carmel Highlands • Carmel, California
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="elegant-serif mb-6 text-4xl font-light text-foreground md:text-5xl">
            Join Us in Celebrating Our Love
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We are thrilled to invite you to share in the joy of our wedding weekend. Your presence
            would mean the world to us as we begin this beautiful journey together.
          </p>
        </div>

        <SectionDivider />

        <div className="mb-16">
          <CountdownTimer />
        </div>

        <SectionDivider />

        <div className="mb-16 grid gap-6 md:grid-cols-3">
          <Card className="coastal-shadow border-0 p-8 text-center">
            <div className="mb-4 text-4xl">🧧</div>
            <h3 className="elegant-serif mb-2 text-2xl text-primary">Tea Ceremony</h3>
            <p className="mb-2 text-muted-foreground">September 11, 2026</p>
            <p className="mb-2 text-sm">2:00 PM</p>
            <p className="text-xs italic text-muted-foreground">Immediate family only</p>
          </Card>

          <Card className="coastal-shadow border-0 p-8 text-center">
            <div className="mb-4 text-4xl">🥂</div>
            <h3 className="elegant-serif mb-2 text-2xl text-primary">Welcome Party</h3>
            <p className="mb-2 text-muted-foreground">September 11, 2026</p>
            <p className="text-sm">7:00 PM</p>
          </Card>

          <Card className="coastal-shadow border-0 p-8 text-center">
            <div className="mb-4 text-4xl">💒</div>
            <h3 className="elegant-serif mb-2 text-2xl text-primary">Wedding Ceremony</h3>
            <p className="mb-2 text-muted-foreground">September 12, 2026</p>
            <p className="text-sm">4:00 PM</p>
          </Card>
        </div>

        <div className="space-y-6 text-center">
          <Link href="/rsvp">
            <Button
              size="lg"
              className="px-12 text-base tracking-wide"
              data-testid="button-rsvp-home"
            >
              RSVP NOW
            </Button>
          </Link>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/events">
              <Button variant="outline" size="lg" className="px-8" data-testid="button-events-home">
                View Full Schedule
              </Button>
            </Link>
            <Link href="/venue">
              <Button variant="outline" size="lg" className="px-8" data-testid="button-venue-home">
                Travel Information
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
