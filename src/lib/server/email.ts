type SendEmailResult =
  | { ok: true; id?: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped: false; error: string };

function getResendConfig(): { apiKey: string; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();

  if (!apiKey) return null;
  if (!from) return null;

  return { apiKey, from };
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendEmailResult> {
  if (process.env.E2E === "1") {
    return { ok: false, skipped: true, reason: "E2E mode" };
  }

  const cfg = getResendConfig();
  if (!cfg) {
    return {
      ok: false,
      skipped: true,
      reason: "Missing RESEND_API_KEY and/or RESEND_FROM",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: cfg.from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        reply_to: input.replyTo,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return {
        ok: false,
        skipped: false,
        error: `Resend API error (${res.status}): ${body.slice(0, 500)}`,
      };
    }

    const data = (await res.json()) as { id?: string } | null;
    return { ok: true, id: data?.id };
  } catch (err) {
    return {
      ok: false,
      skipped: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
