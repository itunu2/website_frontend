import type { CSSProperties } from "react";

interface BrandImageProps {
  width: number;
  height: number;
  includeText?: boolean;
}

export const BrandImage = ({ width, height, includeText = false }: BrandImageProps) => {
  const initialsSize = Math.max(36, Math.round(Math.min(width, height) * (includeText ? 0.22 : 0.42)));
  const badgeSize = Math.round(initialsSize * 1.9);

  const frameStyle: CSSProperties = {
    width,
    height,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F0F0F",
    color: "#FAFAFA",
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif",
  };

  const badgeStyle: CSSProperties = {
    width: badgeSize,
    height: badgeSize,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Math.max(12, Math.round(badgeSize * 0.2)),
    backgroundColor: "#D97706",
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: initialsSize,
    letterSpacing: "0.02em",
    lineHeight: 1,
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  };

  if (!includeText) {
    return (
      <div style={frameStyle}>
        <div style={badgeStyle}>IA</div>
      </div>
    );
  }

  return (
    <div style={frameStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: Math.round(width * 0.035),
        }}
      >
        <div style={badgeStyle}>IA</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.1,
          }}
        >
          <span
            style={{
              fontSize: Math.round(width * 0.055),
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Itunu A.
          </span>
          <span
            style={{
              marginTop: 8,
              fontSize: Math.round(width * 0.026),
              color: "#D4D4D4",
            }}
          >
            Writer • Storyteller • Editorial Creative
          </span>
        </div>
      </div>
    </div>
  );
};
