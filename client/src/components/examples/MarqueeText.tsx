import MarqueeText from "../MarqueeText";

export default function MarqueeTextExample() {
  return (
    <div className="p-8 bg-secondary text-secondary-foreground">
      <MarqueeText>
        ✨ Welcome to Jake & Caroline's Wedding Website! ✨ Save the Date: September 12, 2026! ✨
      </MarqueeText>
    </div>
  );
}
