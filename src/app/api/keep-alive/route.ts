import { env } from "@/config/env";
import { NextResponse } from "next/server";

/**
 * GET /api/keep-alive
 *
 * Pings the Strapi backend health endpoint to prevent the Render free-tier
 * instance from spinning down due to inactivity. This route acts as an
 * EXTERNAL ping — unlike the backend's self-ping, it survives even when the
 * backend process is killed by Render.
 *
 * Call this route:
 *  - From the client-side StrapiKeepAlive component (every 6 min)
 *  - From an external cron service (UptimeRobot / cron-job.org, every 5 min)
 *  - From a Vercel cron (if on Pro plan)
 */

const STRAPI_HEALTH_TIMEOUT_MS = 15_000; // generous timeout for cold starts

export async function GET() {
  const baseUrl = env.client.NEXT_PUBLIC_STRAPI_BASE_URL.replace(/\/$/, "");
  const healthUrl = `${baseUrl}/api/health`;
  const startMs = Date.now();

  try {
    const res = await fetch(healthUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(STRAPI_HEALTH_TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });

    const durationMs = Date.now() - startMs;
    const body = await safeJson(res);

    if (res.ok) {
      console.log(
        `[keep-alive] Strapi ping OK — status=${res.status} duration=${durationMs}ms uptime=${body?.uptimeSeconds ?? "?"}s`
      );
      return NextResponse.json(
        {
          status: "ok",
          strapi: { status: res.status, durationMs, uptime: body?.uptimeSeconds },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Strapi responded but with non-2xx
    console.warn(
      `[keep-alive] Strapi ping DEGRADED — status=${res.status} duration=${durationMs}ms`,
      body
    );
    return NextResponse.json(
      {
        status: "degraded",
        strapi: { status: res.status, durationMs, body },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const durationMs = Date.now() - startMs;
    const message = error instanceof Error ? error.message : String(error);
    const isTimeout =
      (error instanceof DOMException && error.name === "AbortError") ||
      message.includes("timed out");

    console.error(
      `[keep-alive] Strapi ping FAILED — duration=${durationMs}ms timeout=${isTimeout} error=${message}`
    );

    return NextResponse.json(
      {
        status: "error",
        error: message,
        isTimeout,
        durationMs,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function safeJson(res: Response): Promise<any> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
