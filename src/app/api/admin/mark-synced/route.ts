import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isNewsletterAdminAuthorized } from "@/lib/newsletter/admin-auth";

const markSyncedSchema = z.object({
  batchId: z.string().uuid("batchId must be a valid UUID"),
});

export async function POST(request: NextRequest) {
  if (!isNewsletterAdminAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const requestBody = await request.json().catch(() => null);
  const parsedBody = markSyncedSchema.safeParse(requestBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsedBody.error.issues[0]?.message ?? "Invalid request body",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = createServerSupabaseClient();
    const { batchId } = parsedBody.data;

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .update({
        substack_synced: true,
      })
      .eq("sync_batch_id", batchId)
      .eq("substack_synced", false)
      .select("id");

    if (error) {
      return NextResponse.json({ success: false, error: "Failed to mark batch as synced" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      markedCount: data?.length ?? 0,
      batchId,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to mark synced" }, { status: 500 });
  }
}
