import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const bodySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required").max(300),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const { name, email, subject, message } = parsed.data;
  const ip = getClientIp(request);

  // 1. Store in Supabase
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      subject,
      message,
      ip_address: ip,
    });

    if (error) {
      console.error("[contact] supabase insert failed:", error.message);
      // Continue to send email even if DB insert fails
    }
  } catch (err) {
    console.error("[contact] supabase not configured:", err);
    // Continue — email delivery is the critical path
  }

  // 2. Send notification email via Resend
  const resendKey = process.env.RESEND_API_KEY;
  const contactTo = process.env.CONTACT_EMAIL_TO;

  if (resendKey && contactTo) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Contact Form <onboarding@resend.dev>",
        to: contactTo,
        replyTo: email,
        subject: `[Website] ${subject}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Subject: ${subject}`,
          "",
          message,
        ].join("\n"),
      });
    } catch (err) {
      console.error("[contact] resend failed:", err);
      // Don't fail the request — the submission is saved in Supabase
    }
  }

  return NextResponse.json({
    success: true,
    message: "Message sent! I'll get back to you soon.",
  });
}
