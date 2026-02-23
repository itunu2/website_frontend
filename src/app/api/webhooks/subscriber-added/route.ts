import { NextRequest, NextResponse } from "next/server";
import { isNewsletterWebhookAuthorized } from "@/lib/newsletter/admin-auth";

export async function POST(request: NextRequest) {
  if (!isNewsletterWebhookAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);

  return NextResponse.json({
    success: true,
    message: "Webhook received",
    queued: false,
    note: "Attach a delayed job provider (QStash/queue worker) to batch and export pending subscribers.",
    hasPayload: Boolean(payload),
  });
}
