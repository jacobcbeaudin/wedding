import SectionDivider from "@/components/SectionDivider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Registry() {
  return (
    <div className="py-20 container mx-auto px-6 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="elegant-serif text-5xl md:text-6xl font-light mb-6 text-foreground">
          Gift Registry
        </h1>
        <p className="text-lg text-muted-foreground">Your love is the greatest gift</p>
      </div>

      <SectionDivider />

      <Card className="p-12 text-center max-w-2xl mx-auto mb-12 coastal-shadow border-0">
        <h2 className="elegant-serif text-3xl mb-6 text-primary">
          Your Presence is Our Present
        </h2>
        <p className="text-lg mb-6 text-foreground leading-relaxed">
          We are so grateful that you're able to join us for our special day. 
          Your love, laughter, and presence at our wedding is the greatest gift we could ask for.
        </p>
        <p className="text-foreground leading-relaxed">
          However, if you would like to contribute to our honeymoon adventure 
          or help us start our new life together, we would be incredibly touched.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
        <Card className="p-8 text-center coastal-shadow border-0">
          <h3 className="elegant-serif text-2xl mb-4 text-primary">Venmo</h3>
          <p className="text-lg mb-6 font-medium text-foreground">@JakeAndCaroline2026</p>
          <Button 
            className="w-full"
            onClick={() => {
              console.log("Venmo clicked");
              window.open("https://venmo.com", "_blank");
            }}
            data-testid="button-venmo"
          >
            Send via Venmo
          </Button>
        </Card>

        <Card className="p-8 text-center coastal-shadow border-0">
          <h3 className="elegant-serif text-2xl mb-4 text-primary">PayPal</h3>
          <p className="text-lg mb-6 font-medium text-foreground">jakecaroline@wedding.com</p>
          <Button 
            className="w-full"
            onClick={() => {
              console.log("PayPal clicked");
              window.open("https://paypal.com", "_blank");
            }}
            data-testid="button-paypal"
          >
            Send via PayPal
          </Button>
        </Card>
      </div>

      <Card className="p-8 max-w-2xl mx-auto bg-secondary/20 border-0">
        <h3 className="elegant-serif text-2xl mb-4 text-center text-primary">Our Honeymoon Plans</h3>
        <p className="text-foreground leading-relaxed text-center">
          We're planning an amazing two-week adventure through Japan! 
          From exploring Tokyo's vibrant neighborhoods to hiking Mount Fuji, 
          relaxing in traditional onsens in Hakone, and wandering through the 
          historic temples of Kyoto. Your contributions will help make this 
          dream trip a reality and give us memories to last a lifetime!
        </p>
      </Card>

      <div className="text-center mt-12">
        <p className="elegant-serif text-xl text-foreground">
          Thank you for your love and generosity
        </p>
      </div>
    </div>
  );
}
