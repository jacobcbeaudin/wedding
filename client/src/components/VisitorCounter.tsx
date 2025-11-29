import { useEffect, useState } from "react";

export default function VisitorCounter() {
  // Mock visitor count for design prototype
  const [count, setCount] = useState(1234);

  useEffect(() => {
    // Simulate random visitor counts for demo
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-card border-2 border-border px-4 py-2 retro-border">
      <span className="text-sm font-bold">Visitors:</span>
      <div className="flex gap-1">
        {count.toString().split("").map((digit, i) => (
          <div
            key={i}
            className="bg-black text-accent font-mono text-lg px-2 py-1 min-w-[2rem] text-center"
            style={{ fontFamily: "monospace" }}
            data-testid={`counter-digit-${i}`}
          >
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
}
