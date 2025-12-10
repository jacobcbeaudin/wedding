import { useState } from 'react';
import SectionDivider from '@/components/SectionDivider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';
import type { GuestPublic } from '@shared/schema';

type RsvpStatus = 'attending' | 'declined';

interface RsvpFormData {
  teaCeremonyStatus?: RsvpStatus;
  welcomePartyStatus?: RsvpStatus;
  weddingStatus?: RsvpStatus;
  dietaryRestrictions: string;
  songRequests: string;
}

export default function RSVP() {
  const { toast } = useToast();
  const [step, setStep] = useState<'lookup' | 'form' | 'confirmation'>('lookup');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guest, setGuest] = useState<GuestPublic | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState<RsvpFormData>({
    dietaryRestrictions: '',
    songRequests: '',
  });

  const lookupQuery = trpc.rsvp.lookup.useQuery(
    { firstName, lastName },
    {
      enabled: false,
      retry: false,
    }
  );

  const submitMutation = trpc.rsvp.submit.useMutation({
    onSuccess: (data) => {
      setGuest(data.guest as GuestPublic);
      setStep('confirmation');
      toast({
        title: 'RSVP Submitted',
        description: "Thank you! We can't wait to celebrate with you.",
      });
    },
    onError: (err) => {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    },
  });

  const handleLookup = async () => {
    setLookupError('');
    const result = await lookupQuery.refetch();

    if (result.data?.guest) {
      const fetchedGuest = result.data.guest;
      setGuest(fetchedGuest as GuestPublic);
      setFormData({
        teaCeremonyStatus:
          fetchedGuest.teaCeremonyStatus === 'pending'
            ? undefined
            : (fetchedGuest.teaCeremonyStatus as RsvpStatus),
        welcomePartyStatus:
          fetchedGuest.welcomePartyStatus === 'pending'
            ? undefined
            : (fetchedGuest.welcomePartyStatus as RsvpStatus),
        weddingStatus:
          fetchedGuest.weddingStatus === 'pending'
            ? undefined
            : (fetchedGuest.weddingStatus as RsvpStatus),
        dietaryRestrictions: fetchedGuest.dietaryRestrictions || '',
        songRequests: fetchedGuest.songRequests || '',
      });
      setStep('form');
    } else if (result.error) {
      setLookupError(
        result.error.message ||
          "We couldn't find your name. Please check the spelling matches your invitation."
      );
    }
  };

  const handleSubmitRSVP = () => {
    if (!guest) return;
    setSubmitError('');
    submitMutation.mutate({
      guestId: guest.id,
      ...formData,
    });
  };

  const capitalizeName = (name: string) => {
    return name
      .split(/(\s+|-)/g)
      .map((part) => {
        if (part === ' ' || part === '-') return part;
        if (part.includes("'")) {
          const [before, after] = part.split("'");
          return (
            before.charAt(0).toUpperCase() +
            before.slice(1) +
            "'" +
            (after.charAt(0).toUpperCase() + after.slice(1))
          );
        }
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join('');
  };

  if (step === 'confirmation') {
    return (
      <div className="container mx-auto max-w-4xl px-6 py-20">
        <div className="mb-12 text-center">
          <h1 className="elegant-serif mb-6 text-5xl font-light text-foreground md:text-6xl">
            Thank You!
          </h1>
        </div>

        <Card className="coastal-shadow mx-auto max-w-2xl border-0 p-12 text-center">
          <div className="mb-6 text-6xl">✓</div>
          <h2 className="elegant-serif mb-6 text-3xl text-primary">Your RSVP is Confirmed</h2>
          <p className="mb-6 text-lg text-foreground">
            We can't wait to celebrate with you on our special day.
          </p>
          <Button variant="outline" onClick={() => setStep('form')} data-testid="button-edit-rsvp">
            Edit My RSVP
          </Button>
        </Card>
      </div>
    );
  }

  if (step === 'form' && guest) {
    const displayName = `${capitalizeName(guest.firstName)} ${capitalizeName(guest.lastName)}`;

    return (
      <div className="container mx-auto max-w-4xl px-6 py-20">
        <div className="mb-12 text-center">
          <h1 className="elegant-serif mb-6 text-5xl font-light text-foreground md:text-6xl">
            RSVP
          </h1>
        </div>

        <SectionDivider />

        <Card className="coastal-shadow mb-8 border-0 p-8">
          <h2 className="elegant-serif mb-4 text-2xl text-primary">Welcome, {displayName}</h2>
          <p className="text-muted-foreground">
            Please let us know if you'll be attending each event.
          </p>
        </Card>

        <Card className="coastal-shadow mb-8 border-0 p-8">
          <h3 className="mb-6 text-xl font-medium text-foreground">Your Events</h3>

          <div className="space-y-6">
            {guest.invitedToTeaCeremony && (
              <div className="rounded-lg bg-muted/30 p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-foreground">Tea Ceremony</h4>
                  <p className="text-sm text-muted-foreground">
                    Thursday, September 11, 2026 at 2:00 PM
                  </p>
                </div>
                <RadioGroup
                  value={formData.teaCeremonyStatus}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, teaCeremonyStatus: value as RsvpStatus })
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="attending"
                      id="tea-yes"
                      data-testid="radio-tea-attending"
                    />
                    <Label htmlFor="tea-yes" className="cursor-pointer">
                      Joyfully Accept
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="declined" id="tea-no" data-testid="radio-tea-declined" />
                    <Label htmlFor="tea-no" className="cursor-pointer">
                      Regretfully Decline
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {guest.invitedToWelcomeParty && (
              <div className="rounded-lg bg-muted/30 p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-foreground">Welcome Party</h4>
                  <p className="text-sm text-muted-foreground">
                    Thursday, September 11, 2026 at 7:00 PM
                  </p>
                </div>
                <RadioGroup
                  value={formData.welcomePartyStatus}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, welcomePartyStatus: value as RsvpStatus })
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="attending"
                      id="welcome-yes"
                      data-testid="radio-welcome-attending"
                    />
                    <Label htmlFor="welcome-yes" className="cursor-pointer">
                      Joyfully Accept
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="declined"
                      id="welcome-no"
                      data-testid="radio-welcome-declined"
                    />
                    <Label htmlFor="welcome-no" className="cursor-pointer">
                      Regretfully Decline
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {guest.invitedToWedding && (
              <div className="rounded-lg bg-muted/30 p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-foreground">
                    Wedding Ceremony & Reception
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Friday, September 12, 2026 at 4:00 PM
                  </p>
                </div>
                <RadioGroup
                  value={formData.weddingStatus}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, weddingStatus: value as RsvpStatus })
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="attending"
                      id="wedding-yes"
                      data-testid="radio-wedding-attending"
                    />
                    <Label htmlFor="wedding-yes" className="cursor-pointer">
                      Joyfully Accept
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="declined"
                      id="wedding-no"
                      data-testid="radio-wedding-declined"
                    />
                    <Label htmlFor="wedding-no" className="cursor-pointer">
                      Regretfully Decline
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <Label htmlFor="dietary" className="mb-2 block text-base font-medium text-foreground">
                Dietary Restrictions / Allergies
              </Label>
              <Textarea
                id="dietary"
                placeholder="Please let us know of any dietary restrictions or allergies..."
                rows={3}
                value={formData.dietaryRestrictions}
                onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                data-testid="textarea-dietary"
              />
            </div>

            <div>
              <Label htmlFor="songs" className="mb-2 block text-base font-medium text-foreground">
                Song Requests
              </Label>
              <Textarea
                id="songs"
                placeholder="Any songs you'd love to hear at the reception?"
                rows={2}
                value={formData.songRequests}
                onChange={(e) => setFormData({ ...formData, songRequests: e.target.value })}
                data-testid="textarea-songs"
              />
            </div>
          </div>

          {submitError && <p className="mt-4 text-sm text-destructive">{submitError}</p>}
        </Card>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setStep('lookup');
              setGuest(null);
              setFirstName('');
              setLastName('');
            }}
            disabled={submitMutation.isPending}
            data-testid="button-cancel"
          >
            Start Over
          </Button>
          <Button
            onClick={handleSubmitRSVP}
            disabled={submitMutation.isPending}
            data-testid="button-submit-rsvp"
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit RSVP'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-6 py-20">
      <div className="mb-12 text-center">
        <h1 className="elegant-serif mb-6 text-5xl font-light text-foreground md:text-6xl">RSVP</h1>
        <p className="text-lg text-muted-foreground">We hope you can join us</p>
      </div>

      <SectionDivider />

      <Card className="coastal-shadow mx-auto max-w-2xl border-0 p-10">
        <h2 className="elegant-serif mb-6 text-center text-3xl text-primary">
          Find Your Invitation
        </h2>

        <p className="mb-8 text-center text-muted-foreground">
          Please enter your name as it appears on your invitation
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="first-name" className="mb-2 block text-base font-medium">
              First Name
            </Label>
            <Input
              id="first-name"
              placeholder="Enter your first name..."
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={lookupQuery.isFetching}
              data-testid="input-first-name"
            />
          </div>

          <div>
            <Label htmlFor="last-name" className="mb-2 block text-base font-medium">
              Last Name
            </Label>
            <Input
              id="last-name"
              placeholder="Enter your last name..."
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={lookupQuery.isFetching}
              data-testid="input-last-name"
            />
          </div>

          {lookupError && <p className="text-sm text-destructive">{lookupError}</p>}

          <Button
            onClick={handleLookup}
            disabled={!firstName || !lastName || lookupQuery.isFetching}
            className="w-full"
            size="lg"
            data-testid="button-lookup-guest"
          >
            {lookupQuery.isFetching ? 'Searching...' : 'Find My Invitation'}
          </Button>
        </div>

        <div className="mt-8 rounded bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Can't find your invitation? Contact us at{' '}
            <a href="mailto:wedding@carolineandjake.com" className="text-primary underline">
              wedding@carolineandjake.com
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
