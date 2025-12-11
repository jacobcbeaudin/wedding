'use client';

import { useEffect, useState, useCallback } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const WEDDING_DATE = new Date('2026-09-12T00:00:00');

export default function CountdownTimer() {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = +WEDDING_DATE - +new Date();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, []);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="text-center">
      <div className="inline-flex items-baseline gap-1 sm:gap-2">
        <span
          className="elegant-serif text-3xl text-primary sm:text-4xl"
          data-testid="countdown-days"
        >
          {timeLeft.days}
        </span>
        <span className="text-sm text-muted-foreground sm:text-base">days</span>
        <span className="px-1 text-muted-foreground/50 sm:px-2">&middot;</span>
        <span
          className="elegant-serif text-3xl text-primary sm:text-4xl"
          data-testid="countdown-hours"
        >
          {timeLeft.hours}
        </span>
        <span className="text-sm text-muted-foreground sm:text-base">hrs</span>
        <span className="px-1 text-muted-foreground/50 sm:px-2">&middot;</span>
        <span
          className="elegant-serif text-3xl text-primary sm:text-4xl"
          data-testid="countdown-minutes"
        >
          {timeLeft.minutes}
        </span>
        <span className="text-sm text-muted-foreground sm:text-base">min</span>
        <span className="px-1 text-muted-foreground/50 sm:px-2">&middot;</span>
        <span
          className="elegant-serif text-3xl text-primary sm:text-4xl"
          data-testid="countdown-seconds"
        >
          {timeLeft.seconds}
        </span>
        <span className="text-sm text-muted-foreground sm:text-base">sec</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground sm:mt-4">until we say &ldquo;I do&rdquo;</p>
    </div>
  );
}
