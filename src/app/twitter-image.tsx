import { ImageResponse } from "next/og";
import { BrandImage } from "@/app/metadata-brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<BrandImage width={size.width} height={size.height} />, { ...size });
}
