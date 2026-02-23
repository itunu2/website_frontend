import { ImageResponse } from "next/og";
import { BrandImage } from "@/app/metadata-brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandImage width={size.width} height={size.height} />, { ...size });
}
