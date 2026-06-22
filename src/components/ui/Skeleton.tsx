import type { CSSProperties } from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  style?: CSSProperties;
}

export default function Skeleton({ width, height, radius = 6, style }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: radius,
        background: "var(--surface-soft)",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
