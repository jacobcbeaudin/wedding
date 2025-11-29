export default function RainbowDivider() {
  return (
    <div 
      className="h-1 w-full my-6"
      style={{
        background: "linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)",
      }}
      data-testid="rainbow-divider"
    />
  );
}
