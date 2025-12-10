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
    <div className="mx-auto max-w-3xl">
      <h2 className="elegant-serif mb-8 text-center text-3xl text-foreground">
        Counting Down to Our Big Day
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="text-center">
            <div
              className="coastal-shadow rounded-lg border border-card-border bg-card p-4 sm:p-6"
              data-testid={`countdown-${unit}`}
            >
              <div className="elegant-serif mb-2 text-3xl font-light text-primary sm:text-5xl">
                {value.toString().padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{unit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
