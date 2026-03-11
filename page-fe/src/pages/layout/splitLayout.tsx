import { useState } from "react";

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function SplitPane({ left, right }: SplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(420);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const startX = event.clientX;
    const startWidth = leftWidth;

    const onMouseMove = (e: MouseEvent) => {
      const next = startWidth + (e.clientX - startX);
      if (next >= 320 && next <= 620) {
        setLeftWidth(next);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${leftWidth}px 8px 1fr`,
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          minWidth: 0,
          minHeight: 0,
          overflow: "hidden",
          background: "#ffffff",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        {left}
      </div>

      <div
        onMouseDown={handleMouseDown}
        style={{
          background: "#e5e7eb",
          cursor: "col-resize",
        }}
      />

      <div
        style={{
          minWidth: 0,
          minHeight: 0,
          overflow: "hidden",
          background: "#f8fafc",
        }}
      >
        {right}
      </div>
    </div>
  );
}