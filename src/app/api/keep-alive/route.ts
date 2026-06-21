import { env } from "@/config/env";
import { NextResponse } from "next/server";

const HEALTH_TIMEOUT_MS = 15_000;

export async function GET() {
  const base = env.client.NEXT_PUBLIC_STRAPI_BASE_URL.replace(/\/$/, "");
  const healthUrl = `${base}/api/health`;
  const start = Date.now();

  try {
    const res = await fetch(healthUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });

    const durationMs = Date.now() - start;
    const body = await res.json().catch(() => null);

    if (res.ok) {
      return NextResponse.json({
        status: "ok",
        strapi: { status: res.status, durationMs, uptime: body?.uptimeSeconds },
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      status: "degraded",
      strapi: { status: res.status, durationMs },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : String(error);
    const isTimeout =
      (error instanceof DOMException && error.name === "AbortError") ||
      message.includes("timed out");

    return NextResponse.json(
      {
        status: "error",
        error: message,
        isTimeout,
        durationMs,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
