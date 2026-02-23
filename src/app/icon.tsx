import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#1a1a1a",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          fontSize: 13,
          fontWeight: 600,
          color: "#f5f0e8",
          letterSpacing: "0.02em",
        }}
      >
        IA
      </div>
    ),
    { ...size }
  );
}
