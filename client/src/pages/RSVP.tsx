import { useState } from "react";
import SectionDivider from "@/components/SectionDivider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function RSVP() {
  const [step, setStep] = useState<"lookup" | "form" | "confirmation">("lookup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleLookup = () => {
    console.log("Looking up guest:", firstName, lastName);
    setStep("form");
  };

  const handleSubmitRSVP = () => {
    console.log("RSVP submitted");
    setStep("confirmation");
  };

  if (step === "confirmation") {
    return (
      <div className="py-20 container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="elegant-serif text-5xl md:text-6xl font-light mb-6 text-foreground">
            Thank You!
          </h1>
        </div>
        
        <Card className="p-12 text-center max-w-2xl mx-auto coastal-shadow border-0">
          <div className="text-6xl mb-6">✓</div>
          <h2 className="elegant-serif text-3xl mb-6 text-primary">Your RSVP is Confirmed</h2>
          <p className="text-lg mb-6 text-foreground">
            We can't wait to celebrate with you on our special day.
          </p>
          <p className="text-muted-foreground mb-8">
            A confirmation email has been sent to your email address.
          </p>
          <Button 
            variant="outline"
            onClick={() => setStep("lookup")}
            data-testid="button-edit-rsvp"
          >
            Edit My RSVP
          </Button>
        </Card>
      </div>
    );
  }

  if (step === "form") {
    return (
      <div className="py-20 container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="elegant-serif text-5xl md:text-6xl font-light mb-6 text-foreground">
            RSVP
          </h1>
        </div>

        <SectionDivider />

        <Card className="p-8 mb-8 coastal-shadow border-0">
          <h2 className="elegant-serif text-2xl mb-4 text-primary">
            Welcome, John Smith
          </h2>
          <p className="text-muted-foreground">
            Please let us know which events you'll be attending.
          </p>
        </Card>

        <Card className="p-8 mb-8 coastal-shadow border-0">
          <h3 className="text-xl font-medium mb-6 text-foreground">Your Events</h3>
          
          <div className="space-y-6">
            <div className="p-6 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-4">
                <Checkbox id="tea" defaultChecked className="mt-1" data-testid="checkbox-tea-ceremony" />
                <div className="flex-1">
                  <Label htmlFor="tea" className="text-lg font-medium cursor-pointer text-foreground">
                    Tea Ceremony
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">Thursday, September 11, 2026 at 2:00 PM</p>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="tea-guests" className="text-sm whitespace-nowrap">Number of guests:</Label>
                    <Input 
                      id="tea-guests" 
                      type="number" 
                      min="0" 
                      max="2" 
                      defaultValue="2" 
                      className="w-20"
                      data-testid="input-tea-guests"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-4">
                <Checkbox id="welcome" defaultChecked className="mt-1" data-testid="checkbox-welcome-party" />
                <div className="flex-1">
                  <Label htmlFor="welcome" className="text-lg font-medium cursor-pointer text-foreground">
                    Welcome Party
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">Thursday, September 11, 2026 at 7:00 PM</p>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="welcome-guests" className="text-sm whitespace-nowrap">Number of guests:</Label>
                    <Input 
                      id="welcome-guests" 
                      type="number" 
                      min="0" 
                      max="2" 
                      defaultValue="2" 
                      className="w-20"
                      data-testid="input-welcome-guests"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-4">
                <Checkbox id="wedding" defaultChecked className="mt-1" data-testid="checkbox-wedding-ceremony" />
                <div className="flex-1">
                  <Label htmlFor="wedding" className="text-lg font-medium cursor-pointer text-foreground">
                    Wedding Ceremony & Reception
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">Friday, September 12, 2026 at 4:00 PM</p>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="wedding-guests" className="text-sm whitespace-nowrap">Number of guests:</Label>
                    <Input 
                      id="wedding-guests" 
                      type="number" 
                      min="0" 
                      max="2" 
                      defaultValue="2" 
                      className="w-20"
                      data-testid="input-wedding-guests"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <Label htmlFor="guest-names" className="text-base font-medium mb-2 block text-foreground">
                Additional Guest Names
              </Label>
              <Input 
                id="guest-names" 
                placeholder="e.g., Jane Smith"
                data-testid="input-guest-names"
              />
            </div>

            <div>
              <Label htmlFor="dietary" className="text-base font-medium mb-2 block text-foreground">
                Dietary Restrictions / Food Allergies
              </Label>
              <Textarea 
                id="dietary" 
                placeholder="Please let us know of any dietary restrictions or allergies..."
                rows={3}
                data-testid="textarea-dietary"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setStep("lookup")}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitRSVP}
            data-testid="button-submit-rsvp"
          >
            Submit RSVP
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 container mx-auto px-6 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="elegant-serif text-5xl md:text-6xl font-light mb-6 text-foreground">
          RSVP
        </h1>
        <p className="text-lg text-muted-foreground">We hope you can join us</p>
      </div>

      <SectionDivider />

      <Card className="p-10 max-w-2xl mx-auto coastal-shadow border-0">
        <h2 className="elegant-serif text-3xl mb-6 text-center text-primary">
          Find Your Invitation
        </h2>
        
        <p className="text-center mb-8 text-muted-foreground">
          Please enter your name as it appears on your invitation
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="first-name" className="text-base font-medium mb-2 block">
              First Name
            </Label>
            <Input 
              id="first-name"
              placeholder="Enter your first name..."
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              data-testid="input-first-name"
            />
          </div>

          <div>
            <Label htmlFor="last-name" className="text-base font-medium mb-2 block">
              Last Name
            </Label>
            <Input 
              id="last-name"
              placeholder="Enter your last name..."
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              data-testid="input-last-name"
            />
          </div>

          <Button 
            onClick={handleLookup}
            disabled={!firstName || !lastName}
            className="w-full"
            size="lg"
            data-testid="button-lookup-guest"
          >
            Find My Invitation
          </Button>
        </div>

        <div className="mt-8 p-6 bg-muted/30 rounded text-center">
          <p className="text-sm text-muted-foreground">
            Can't find your invitation? Contact us at{" "}
            <a href="mailto:wedding@carolineandjake.com" className="text-primary underline">
              wedding@carolineandjake.com
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
