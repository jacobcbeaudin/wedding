import { ReactNode } from "react";

interface MarqueeTextProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export default function MarqueeText({ children, speed = 50, className = "" }: MarqueeTextProps) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="inline-block animate-marquee"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <span className="inline-block pr-8">{children}</span>
        <span className="inline-block pr-8">{children}</span>
      </div>
    </div>
  );
}
