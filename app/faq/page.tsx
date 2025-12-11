'use client';

import CoastalLayout from '@/components/CoastalLayout';
import SectionDivider from '@/components/SectionDivider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

export default function FAQ() {
  return (
    <CoastalLayout>
      <div className="container mx-auto max-w-4xl px-6 py-12 sm:py-20">
        <div className="mb-12 text-center sm:mb-16">
          <h1 className="elegant-serif mb-6 text-4xl font-light text-foreground sm:text-5xl md:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">Everything you need to know</p>
        </div>

        <SectionDivider />

        <Card className="coastal-shadow border-0 p-6 sm:p-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger
                className="text-base font-medium sm:text-lg"
                data-testid="faq-dress-code"
              >
                What should I wear?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground sm:text-base">
                <p className="mb-2">
                  <strong>Tea Ceremony:</strong> Semi-formal / Cocktail attire
                </p>
                <p className="mb-2">
                  <strong>Welcome Party:</strong> Casual chic / Resort casual
                </p>
                <p className="mb-2">
                  <strong>Wedding:</strong> Formal / Black tie optional
                </p>
                <p className="mt-4 text-muted-foreground">
                  For the wedding ceremony, think cocktail dresses, formal jumpsuits, or suits and
                  ties. It&apos;s an outdoor ceremony, so comfortable dress shoes are recommended!
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger
                className="text-base font-medium sm:text-lg"
                data-testid="faq-parking"
              >
                Is parking available?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground sm:text-base">
                Yes! The Hyatt Highlands Carmel Inn offers complimentary valet and self-parking for
                all wedding guests.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-base font-medium sm:text-lg" data-testid="faq-kids">
                Can I bring my children?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground sm:text-base">
                While we love your little ones, we&apos;ve decided to make our wedding an
                adults-only celebration (18 and over). We hope this gives you a chance to enjoy a
                night off!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger
                className="text-base font-medium sm:text-lg"
                data-testid="faq-plusone"
              >
                Can I bring a plus-one?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground sm:text-base">
                Due to venue capacity, we can only accommodate guests formally invited on your RSVP.
                If you have a plus-one, they will be indicated on your invitation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-base font-medium sm:text-lg" data-testid="faq-food">
                What food will be served?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground sm:text-base">
                <p className="mb-2">
                  <strong>Tea Ceremony:</strong> Traditional Chinese tea and light refreshments
                </p>
                <p className="mb-2">
                  <strong>Welcome Party:</strong> Heavy appetizers and open bar
                </p>
                <p className="mb-2">
                  <strong>Wedding:</strong> Multi-course plated dinner with vegetarian options
                </p>
                <p className="mt-4 text-muted-foreground">
                  Please let us know about dietary restrictions when you RSVP!
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger
                className="text-base font-medium sm:text-lg"
                data-testid="faq-accommodation"
              >
                When should I book my hotel?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground sm:text-base">
                We recommend booking as soon as possible! Our room block at the Hyatt Highlands must
                be booked by August 12, 2026 using code BEAUDINZHANG2026.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger
                className="text-base font-medium sm:text-lg"
                data-testid="faq-weather"
              >
                What will the weather be like?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground sm:text-base">
                September in Carmel is beautiful! Expect temperatures in the mid-60s to
                low-70s&deg;F during the day. It can get cooler in the evening, so bring a light
                jacket or wrap.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-base font-medium sm:text-lg" data-testid="faq-rsvp">
                When is the RSVP deadline?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground sm:text-base">
                Please RSVP by August 1, 2026. This gives us enough time to finalize our headcount.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger
                className="text-base font-medium sm:text-lg"
                data-testid="faq-photos"
              >
                Will there be a photographer?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground sm:text-base">
                Yes! We&apos;ll have a professional photographer and videographer. We kindly ask
                that you keep phones away during the ceremony. We&apos;ll share all professional
                photos after the wedding.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger
                className="text-base font-medium sm:text-lg"
                data-testid="faq-gifts"
              >
                Do you have a registry?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground sm:text-base">
                Your presence is the greatest gift! However, if you&apos;d like to contribute to our
                honeymoon fund, you can find our Venmo and PayPal information on the Gift Registry
                page.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <div className="mt-8 text-center sm:mt-12">
          <p className="elegant-serif mb-2 text-lg text-foreground sm:text-xl">
            Still have questions?
          </p>
          <p className="text-sm text-muted-foreground sm:text-base">
            Email us at{' '}
            <a href="mailto:wedding@carolineandjake.com" className="text-primary underline">
              wedding@carolineandjake.com
            </a>
          </p>
        </div>
      </div>
    </CoastalLayout>
  );
}
