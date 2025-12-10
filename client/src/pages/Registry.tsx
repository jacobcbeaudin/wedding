import SectionDivider from '@/components/SectionDivider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Registry() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-20">
      <div className="mb-16 text-center">
        <h1 className="elegant-serif mb-6 text-5xl font-light text-foreground md:text-6xl">
          Gift Registry
        </h1>
        <p className="text-lg text-muted-foreground">Your love is the greatest gift</p>
      </div>

      <SectionDivider />

      <Card className="coastal-shadow mx-auto mb-12 max-w-2xl border-0 p-12 text-center">
        <h2 className="elegant-serif mb-6 text-3xl text-primary">Your Presence is Our Present</h2>
        <p className="mb-6 text-lg leading-relaxed text-foreground">
          We are so grateful that you're able to join us for our special day. Your love, laughter,
          and presence at our wedding is the greatest gift we could ask for.
        </p>
        <p className="leading-relaxed text-foreground">
          However, if you would like to contribute to our honeymoon adventure or help us start our
          new life together, we would be incredibly touched.
        </p>
      </Card>

      <div className="mx-auto mb-12 grid max-w-4xl gap-6 md:grid-cols-3">
        <Card className="coastal-shadow border-0 p-8 text-center">
          <h3 className="elegant-serif mb-4 text-2xl text-primary">Honeyfund</h3>
          <p className="mb-6 text-muted-foreground">Contribute to our honeymoon experiences</p>
          <Button
            className="w-full"
            onClick={() => {
              window.open('https://www.honeyfund.com/', '_blank');
            }}
            data-testid="button-honeyfund"
          >
            View Our Registry
          </Button>
        </Card>

        <Card className="coastal-shadow border-0 p-8 text-center">
          <h3 className="elegant-serif mb-4 text-2xl text-primary">Venmo</h3>
          <p className="mb-6 text-muted-foreground">@YourVenmoHandle</p>
          <Button
            className="w-full"
            onClick={() => {
              window.open('https://venmo.com/', '_blank');
            }}
            data-testid="button-venmo"
          >
            Send via Venmo
          </Button>
        </Card>

        <Card className="coastal-shadow border-0 p-8 text-center">
          <h3 className="elegant-serif mb-4 text-2xl text-primary">PayPal</h3>
          <p className="mb-6 text-muted-foreground">your@email.com</p>
          <Button
            className="w-full"
            onClick={() => {
              window.open('https://paypal.com/', '_blank');
            }}
            data-testid="button-paypal"
          >
            Send via PayPal
          </Button>
        </Card>
      </div>

      <Card className="mx-auto max-w-2xl border-0 bg-secondary/20 p-8">
        <h3 className="elegant-serif mb-4 text-center text-2xl text-primary">
          Our Honeymoon Plans
        </h3>
        <p className="text-center leading-relaxed text-foreground">
          We're planning an incredible three-week adventure through Australia! From diving the Great
          Barrier Reef and spotting wildlife on Kangaroo Island, to exploring Melbourne's laneways,
          hiking Tasmania's wilderness, experiencing Sydney's iconic harbor, and relaxing on the
          pristine beaches of the Whitsundays. Your contributions will help make this dream trip a
          reality and give us memories to last a lifetime!
        </p>
      </Card>

      <div className="mt-12 text-center">
        <p className="elegant-serif text-xl text-foreground">
          Thank you for your love and generosity
        </p>
      </div>
    </div>
  );
}
