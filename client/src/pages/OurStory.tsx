import SectionDivider from "@/components/SectionDivider";
import { Card } from "@/components/ui/card";
import photo2 from "@assets/generated_images/couple_sunset_beach_photo.png";
import photo3 from "@assets/generated_images/couple_portrait_closeup.png";

export default function OurStory() {
  return (
    <div className="py-20 container mx-auto px-6 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="elegant-serif text-5xl md:text-6xl font-light mb-6 text-foreground">
          Our Story
        </h1>
        <p className="text-lg text-muted-foreground">How two hearts became one</p>
      </div>

      <SectionDivider />

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <img 
            src={photo2} 
            alt="Jake and Caroline" 
            className="rounded-lg coastal-shadow w-full"
          />
        </div>
        <div>
          <h2 className="elegant-serif text-3xl md:text-4xl mb-6 text-primary">
            How We Met
          </h2>
          <p className="text-lg text-foreground leading-relaxed mb-4">
            Our love story began in a charming coffee shop in downtown San Francisco during the fall of 2020. 
            Caroline was struggling with her laptop, and Jake, being the tech-savvy gentleman he is, offered to help.
          </p>
          <p className="text-lg text-foreground leading-relaxed">
            What started as a simple act of kindness turned into a three-hour conversation about everything from 
            their favorite movies to their dreams for the future. They discovered they both loved hiking, had an 
            inexplicable fondness for terrible puns, and shared a passion for trying new restaurants.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="order-2 md:order-1">
          <h2 className="elegant-serif text-3xl md:text-4xl mb-6 text-primary">
            The Proposal
          </h2>
          <p className="text-lg text-foreground leading-relaxed mb-4">
            On a beautiful spring evening in 2025, Jake planned a surprise trip to Big Sur. He told Caroline they 
            were just going for a weekend hike, but he had something much more special in mind.
          </p>
          <p className="text-lg text-foreground leading-relaxed">
            As they reached the top of their favorite trail at sunset, overlooking the Pacific Ocean, Jake got down 
            on one knee. "Caroline, you make every day an adventure. Will you make me the happiest person alive 
            and marry me?" Through happy tears, Caroline said YES!
          </p>
        </div>
        <div className="order-1 md:order-2">
          <img 
            src={photo3} 
            alt="The proposal" 
            className="rounded-lg coastal-shadow w-full"
          />
        </div>
      </div>

      <SectionDivider />

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="p-8 coastal-shadow border-0">
          <h3 className="elegant-serif text-2xl mb-6 text-primary">About Jake</h3>
          <ul className="space-y-3 text-foreground">
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Loves playing guitar and discovering craft breweries</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Can't resist deep dish pizza</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Dreams of hiking in Patagonia</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Always listening to Arctic Monkeys</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Secret talent: makes the best chocolate chip cookies</span>
            </li>
          </ul>
        </Card>

        <Card className="p-8 coastal-shadow border-0">
          <h3 className="elegant-serif text-2xl mb-6 text-primary">About Caroline</h3>
          <ul className="space-y-3 text-foreground">
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Passionate about reading, yoga, and baking sourdough</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Authentic ramen is her favorite food</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Dreams of exploring Tokyo</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Taylor Swift on repeat</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Amazing photographer - all their photos are self-timer shots!</span>
            </li>
          </ul>
        </Card>
      </div>

      <Card className="p-8 bg-secondary/30 border-0">
        <h3 className="elegant-serif text-2xl mb-6 text-center text-primary">Fun Facts About Us</h3>
        <div className="grid md:grid-cols-2 gap-4 text-foreground">
          <div className="flex gap-3">
            <span className="text-primary">•</span>
            <span>We bonded over Mario Kart (Caroline always wins)</span>
          </div>
          <div className="flex gap-3">
            <span className="text-primary">•</span>
            <span>We have two rescue dogs: Biscuit and Muffin</span>
          </div>
          <div className="flex gap-3">
            <span className="text-primary">•</span>
            <span>Our first date was at a taco truck</span>
          </div>
          <div className="flex gap-3">
            <span className="text-primary">•</span>
            <span>We do terrible karaoke together and love it</span>
          </div>
          <div className="flex gap-3">
            <span className="text-primary">•</span>
            <span>We've run three half-marathons together</span>
          </div>
        </div>
      </Card>

      <div className="text-center mt-16">
        <p className="elegant-serif text-2xl text-foreground">
          We can't wait to celebrate with you
        </p>
      </div>
    </div>
  );
}
