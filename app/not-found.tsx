import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center p-6">
      <Card className="coastal-shadow w-full max-w-md border-0">
        <CardContent className="pt-8 text-center">
          <h1 className="elegant-serif text-primary mb-4 text-6xl">404</h1>
          <h2 className="elegant-serif text-foreground mb-4 text-2xl">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Oops! This page seems to have wandered off. Let&apos;s get you back to the celebration.
          </p>
          <Link href="/">
            <Button size="lg">Return Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
