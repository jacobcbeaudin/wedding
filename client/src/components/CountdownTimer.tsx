import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const weddingDate = new Date("2026-09-12T00:00:00");
  
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +weddingDate - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-center elegant-serif text-3xl mb-8 text-foreground">
        Counting Down to Our Big Day
      </h2>
      
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="text-center">
            <div 
              className="bg-card border border-card-border rounded-lg p-6 coastal-shadow"
              data-testid={`countdown-${unit}`}
            >
              <div className="elegant-serif text-5xl font-light text-primary mb-2">
                {value.toString().padStart(2, "0")}
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {unit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
