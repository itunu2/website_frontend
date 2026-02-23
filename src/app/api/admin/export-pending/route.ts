import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isNewsletterAdminAuthorized } from "@/lib/newsletter/admin-auth";

interface PendingSubscriberRow {
  id: string;
  email: string;
  source: string;
  subscribed_at: string;
}

const escapeCsvValue = (value: string) => {
  if (value.includes(",") || value.includes("\n") || value.includes("\"")) {
    return `"${value.replace(/\"/g, '""')}"`;
  }

  return value;
};

const buildCsv = (rows: Array<Omit<PendingSubscriberRow, "id">>) => {
  const header = ["email", "subscribed_at", "source"];
  const body = rows.map((row) =>
    [row.email, row.subscribed_at, row.source].map((value) => escapeCsvValue(String(value))).join(","),
  );

  return [header.join(","), ...body].join("\n");
};

export async function GET(request: NextRequest) {
  if (!isNewsletterAdminAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServerSupabaseClient();

    const { data: pendingRows, error: fetchError } = await supabase
      .from("newsletter_subscribers")
      .select("id,email,source,subscribed_at")
      .eq("substack_synced", false)
      .is("sync_batch_id", null)
      .order("subscribed_at", { ascending: true })
      .limit(5000);

    if (fetchError) {
      return NextResponse.json({ success: false, error: "Failed to fetch pending subscribers" }, { status: 500 });
    }

    const rows = (pendingRows ?? []) as PendingSubscriberRow[];
    if (rows.length === 0) {
      return NextResponse.json({ success: true, message: "No pending subscribers to export" });
    }

    const syncBatchId = randomUUID();
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        sync_batch_id: syncBatchId,
        substack_sync_queued_at: now,
      })
      .in(
        "id",
        rows.map((row) => row.id),
      )
      .eq("substack_synced", false)
      .is("sync_batch_id", null);

    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to assign export batch" }, { status: 500 });
    }

    const csv = buildCsv(
      rows.map((row) => ({
        email: row.email,
        source: row.source,
        subscribed_at: row.subscribed_at,
      })),
    );

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="substack-pending-${syncBatchId}.csv"`,
        "X-Substack-Sync-Batch-Id": syncBatchId,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Export failed" }, { status: 500 });
  }
}
