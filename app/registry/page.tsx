'use client';

import CoastalLayout from '@/components/CoastalLayout';
import SectionDivider from '@/components/SectionDivider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Registry() {
  return (
    <CoastalLayout>
      <div className="container mx-auto max-w-4xl px-6 py-12 sm:py-20">
        <div className="mb-12 text-center sm:mb-16">
          <h1 className="elegant-serif mb-6 text-4xl font-light text-foreground sm:text-5xl md:text-6xl">
            Gift Registry
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Your love is the greatest gift
          </p>
        </div>

        <SectionDivider />

        <Card className="coastal-shadow mx-auto mb-8 max-w-2xl border-0 p-8 text-center sm:mb-12 sm:p-12">
          <h2 className="elegant-serif mb-6 text-2xl text-primary sm:text-3xl">
            Your Presence is Our Present
          </h2>
          <p className="mb-6 text-base leading-relaxed text-foreground sm:text-lg">
            We are so grateful that you&apos;re able to join us for our special day. Your love,
            laughter, and presence at our wedding is the greatest gift we could ask for.
          </p>
          <p className="text-sm leading-relaxed text-foreground sm:text-base">
            However, if you would like to contribute to our honeymoon adventure or help us start our
            new life together, we would be incredibly touched.
          </p>
        </Card>

        <div className="mx-auto mb-8 grid max-w-4xl gap-4 sm:mb-12 sm:gap-6 md:grid-cols-3">
          <Card className="coastal-shadow border-0 p-6 text-center sm:p-8">
            <h3 className="elegant-serif mb-4 text-xl text-primary sm:text-2xl">Honeyfund</h3>
            <p className="mb-6 text-sm text-muted-foreground sm:text-base">
              Contribute to our honeymoon experiences
            </p>
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

          <Card className="coastal-shadow border-0 p-6 text-center sm:p-8">
            <h3 className="elegant-serif mb-4 text-xl text-primary sm:text-2xl">Venmo</h3>
            <p className="mb-6 text-sm text-muted-foreground sm:text-base">@YourVenmoHandle</p>
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

          <Card className="coastal-shadow border-0 p-6 text-center sm:p-8">
            <h3 className="elegant-serif mb-4 text-xl text-primary sm:text-2xl">PayPal</h3>
            <p className="mb-6 text-sm text-muted-foreground sm:text-base">your@email.com</p>
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

        <Card className="mx-auto max-w-2xl border-0 bg-secondary/20 p-6 sm:p-8">
          <h3 className="elegant-serif mb-4 text-center text-xl text-primary sm:text-2xl">
            Our Honeymoon Plans
          </h3>
          <p className="text-center text-sm leading-relaxed text-foreground sm:text-base">
            We&apos;re planning an incredible three-week adventure through Australia! From diving
            the Great Barrier Reef and spotting wildlife on Kangaroo Island, to exploring
            Melbourne&apos;s laneways, hiking Tasmania&apos;s wilderness, experiencing Sydney&apos;s
            iconic harbor, and relaxing on the pristine beaches of the Whitsundays. Your
            contributions will help make this dream trip a reality and give us memories to last a
            lifetime!
          </p>
        </Card>

        <div className="mt-8 text-center sm:mt-12">
          <p className="elegant-serif text-lg text-foreground sm:text-xl">
            Thank you for your love and generosity
          </p>
        </div>
      </div>
    </CoastalLayout>
  );
}
