'use client';

import CoastalLayout from '@/components/CoastalLayout';
import SectionDivider from '@/components/SectionDivider';
import { Card } from '@/components/ui/card';

export default function OurStory() {
  return (
    <CoastalLayout>
      <div className="container mx-auto max-w-5xl px-6 py-12 sm:py-20">
        <div className="mb-12 text-center sm:mb-16">
          <h1 className="elegant-serif mb-6 text-4xl font-light text-foreground sm:text-5xl md:text-6xl">
            Our Story
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">How two hearts became one</p>
        </div>

        <SectionDivider />

        <div className="mb-12 grid items-center gap-8 sm:mb-20 sm:gap-12 md:grid-cols-2">
          <div>
            <img
              src="/images/photo-02.webp"
              alt="Jake and Caroline"
              className="coastal-shadow w-full rounded-lg"
            />
          </div>
          <div>
            <h2 className="elegant-serif mb-4 text-2xl text-primary sm:mb-6 sm:text-3xl md:text-4xl">
              How We Met
            </h2>
            <p className="mb-4 text-base leading-relaxed text-foreground sm:text-lg">
              Our love story began in a charming coffee shop in downtown San Francisco during the
              fall of 2020. Caroline was struggling with her laptop, and Jake, being the tech-savvy
              gentleman he is, offered to help.
            </p>
            <p className="text-base leading-relaxed text-foreground sm:text-lg">
              What started as a simple act of kindness turned into a three-hour conversation about
              everything from their favorite movies to their dreams for the future. They discovered
              they both loved hiking, had an inexplicable fondness for terrible puns, and shared a
              passion for trying new restaurants.
            </p>
          </div>
        </div>

        <div className="mb-12 grid items-center gap-8 sm:mb-20 sm:gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h2 className="elegant-serif mb-4 text-2xl text-primary sm:mb-6 sm:text-3xl md:text-4xl">
              The Proposal
            </h2>
            <p className="mb-4 text-base leading-relaxed text-foreground sm:text-lg">
              On a beautiful spring evening in 2025, Jake planned a surprise trip to Big Sur. He
              told Caroline they were just going for a weekend hike, but he had something much more
              special in mind.
            </p>
            <p className="text-base leading-relaxed text-foreground sm:text-lg">
              As they reached the top of their favorite trail at sunset, overlooking the Pacific
              Ocean, Jake got down on one knee. &quot;Caroline, you make every day an adventure.
              Will you make me the happiest person alive and marry me?&quot; Through happy tears,
              Caroline said YES!
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/images/photo-03.webp"
              alt="The proposal"
              className="coastal-shadow w-full rounded-lg"
            />
          </div>
        </div>

        <SectionDivider />

        <div className="mb-12 grid gap-6 sm:gap-8 md:grid-cols-2">
          <Card className="coastal-shadow border-0 p-6 sm:p-8">
            <h3 className="elegant-serif mb-4 text-xl text-primary sm:mb-6 sm:text-2xl">
              About Jake
            </h3>
            <ul className="space-y-2 text-sm text-foreground sm:space-y-3 sm:text-base">
              <li className="flex gap-3">
                <span className="text-primary">&bull;</span>
                <span>Loves playing guitar and discovering craft breweries</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">&bull;</span>
                <span>Can&apos;t resist deep dish pizza</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">&bull;</span>
                <span>Dreams of hiking in Patagonia</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">&bull;</span>
                <span>Always listening to Arctic Monkeys</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">&bull;</span>
                <span>Secret talent: makes the best chocolate chip cookies</span>
              </li>
            </ul>
          </Card>

          <Card className="coastal-shadow border-0 p-6 sm:p-8">
            <h3 className="elegant-serif mb-4 text-xl text-primary sm:mb-6 sm:text-2xl">
              About Caroline
            </h3>
            <ul className="space-y-2 text-sm text-foreground sm:space-y-3 sm:text-base">
              <li className="flex gap-3">
                <span className="text-primary">&bull;</span>
                <span>Passionate about reading, yoga, and baking sourdough</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">&bull;</span>
                <span>Authentic ramen is her favorite food</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">&bull;</span>
                <span>Dreams of exploring Tokyo</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">&bull;</span>
                <span>Taylor Swift on repeat</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">&bull;</span>
                <span>Amazing photographer - all their photos are self-timer shots!</span>
              </li>
            </ul>
          </Card>
        </div>

        <Card className="border-0 bg-secondary/30 p-6 sm:p-8">
          <h3 className="elegant-serif mb-4 text-center text-xl text-primary sm:mb-6 sm:text-2xl">
            Fun Facts About Us
          </h3>
          <div className="grid gap-3 text-sm text-foreground sm:gap-4 sm:text-base md:grid-cols-2">
            <div className="flex gap-3">
              <span className="text-primary">&bull;</span>
              <span>We bonded over Mario Kart (Caroline always wins)</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary">&bull;</span>
              <span>We have two rescue dogs: Biscuit and Muffin</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary">&bull;</span>
              <span>Our first date was at a taco truck</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary">&bull;</span>
              <span>We do terrible karaoke together and love it</span>
            </div>
            <div className="flex gap-3">
              <span className="text-primary">&bull;</span>
              <span>We&apos;ve run three half-marathons together</span>
            </div>
          </div>
        </Card>

        <div className="mt-12 text-center sm:mt-16">
          <p className="elegant-serif text-xl text-foreground sm:text-2xl">
            We can&apos;t wait to celebrate with you
          </p>
        </div>
      </div>
    </CoastalLayout>
  );
}
