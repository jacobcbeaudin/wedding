import { ReactNode } from "react";
import otterCursor from "@assets/generated_images/pixelated_otter_cursor_icon.png";

interface RetroLayoutProps {
  children: ReactNode;
  backgroundPattern?: "stars" | "hearts" | "checkerboard" | "none";
}

export default function RetroLayout({ children, backgroundPattern = "stars" }: RetroLayoutProps) {
  const getBackgroundStyle = () => {
    switch (backgroundPattern) {
      case "stars":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239FB4C7' fill-opacity='0.2'%3E%3Cpath d='M20 0l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: "hsl(var(--background))",
        };
      case "hearts":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 30c-1-1-10-8-10-15 0-4 3-7 6-7 2 0 4 1 4 3 0-2 2-3 4-3 3 0 6 3 6 7 0 7-9 14-10 15z' fill='%23FF69B4' fill-opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundColor: "hsl(var(--background))",
        };
      case "checkerboard":
        return {
          backgroundImage: `linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          backgroundColor: "hsl(var(--background))",
        };
      default:
        return {
          backgroundColor: "hsl(var(--background))",
        };
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        ...getBackgroundStyle(),
        cursor: `url(${otterCursor}), auto`,
      }}
    >
      {children}
    </div>
  );
}
