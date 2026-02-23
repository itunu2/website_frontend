import type { CSSProperties } from "react";

interface BrandImageProps {
  width: number;
  height: number;
}

export const BrandImage = ({ width, height }: BrandImageProps) => {
  const minDimension = Math.min(width, height);
  const borderRadius = Math.max(6, Math.round(minDimension * 0.18));
  const fontSize = Math.max(13, Math.round(minDimension * 0.4));

  const frameStyle: CSSProperties = {
    width,
    height,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1a1a1a",
    borderRadius,
    fontFamily: "serif",
    fontSize,
    fontWeight: 600,
    color: "#f5f0e8",
    letterSpacing: "0.02em",
    lineHeight: 1,
  };

  return <div style={frameStyle}>IA</div>;
};
