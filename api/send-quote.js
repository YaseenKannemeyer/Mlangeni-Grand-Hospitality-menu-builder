// api/send-quote.js
// ─────────────────────────────────────────────
// Vercel serverless function — server only.
// Sends TWO emails:
//   1. Owner notification (full details, internal style)
//   2. Client confirmation (warm, branded thank-you)
// ─────────────────────────────────────────────
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─────────────────────────────────────────────
// ★ YOUR DETAILS — edit these two lines only
// ─────────────────────────────────────────────
const OWNER_EMAIL = "yaseenkannemeyer@gmail.com"; // ← owner receives full quote details
const FROM_EMAIL = "onboarding@resend.dev"; // ← use this for testing
//   replace with quotes@yourdomain.com
//   once you verify a domain in Resend
// ─────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    contactName,
    contactEmail,
    contactPhone,
    guests,
    eventDate,
    notes,
    selections,
  } = req.body;

  if (!contactName || !contactEmail || !guests || !eventDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ── Shared: build menu HTML block ──────────
  const cats = [
    { label: "Starters", items: selections.starters || [] },
    { label: "Mains", items: selections.mains || [] },
    { label: "Desserts", items: selections.desserts || [] },
    { label: "Beverages", items: selections.beverages || [] },
  ].filter((c) => c.items.length > 0);

  const formattedDate = new Date(eventDate + "T12:00:00").toLocaleDateString(
    "en-ZA",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  const menuHTML = cats
    .map(
      (c) => `
    <h3 style="color:#c9a96e;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;margin:20px 0 8px;">${c.label}</h3>
    <ul style="margin:0;padding-left:20px;">
      ${c.items
        .map(
          (i) => `
        <li style="font-size:14px;color:#333;padding:4px 0;">
          ${i.name}
          ${
            i.tags && i.tags.length > 0
              ? `<span style="font-size:11px;color:#999;"> — ${i.tags.join(", ")}</span>`
              : ""
          }
        </li>
      `,
        )
        .join("")}
    </ul>
  `,
    )
    .join("");

  const totalDishes = cats.reduce((s, c) => s + c.items.length, 0);

  // ════════════════════════════════════════════
  // EMAIL 1 — OWNER NOTIFICATION
  // Full internal details, reply-to is the client
  // ════════════════════════════════════════════
  const ownerEmail = {
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    replyTo: contactEmail,
    subject: `New Quote Request — ${contactName} | ${guests} guests | ${formattedDate}`,
    html: `
      <!DOCTYPE html><html>
      <body style="font-family:Georgia,serif;background:#faf9f6;margin:0;padding:0;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #ece8e0;">

        <div style="background:#1a1a1a;padding:24px 32px;">
          <h1 style="color:#c9a96e;font-size:20px;margin:0;letter-spacing:0.05em;">Mlangeni Grand Hospitality</h1>
          <p style="color:#a0998a;font-size:11px;margin:4px 0 0;letter-spacing:0.12em;text-transform:uppercase;">New Quote Request Received</p>
        </div>

        <div style="padding:28px 32px 0;">
          <h2 style="font-size:15px;color:#1a1a1a;margin:0 0 14px;font-weight:600;">Client Details</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="color:#888;padding:5px 0;width:140px;">Name</td><td style="color:#1a1a1a;font-weight:500;">${contactName}</td></tr>
            <tr><td style="color:#888;padding:5px 0;">Email</td><td><a href="mailto:${contactEmail}" style="color:#c9a96e;">${contactEmail}</a></td></tr>
            <tr><td style="color:#888;padding:5px 0;">Phone</td><td style="color:#1a1a1a;">${contactPhone || "Not provided"}</td></tr>
          </table>
        </div>

        <div style="padding:24px 32px 0;">
          <h2 style="font-size:15px;color:#1a1a1a;margin:0 0 14px;font-weight:600;">Event Details</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="color:#888;padding:5px 0;width:140px;">Guests</td><td style="color:#1a1a1a;font-weight:500;">${guests} people</td></tr>
            <tr><td style="color:#888;padding:5px 0;">Date</td><td style="color:#1a1a1a;font-weight:500;">${formattedDate}</td></tr>
            <tr><td style="color:#888;padding:5px 0;vertical-align:top;">Notes</td><td style="color:#1a1a1a;">${notes || "None provided"}</td></tr>
          </table>
        </div>

        <div style="padding:24px 32px;border-top:1px solid #ece8e0;margin-top:24px;">
          <h2 style="font-size:15px;color:#1a1a1a;margin:0 0 4px;font-weight:600;">Menu Selections</h2>
          <p style="font-size:12px;color:#aaa;margin:0 0 8px;">${cats.length} courses · ${totalDishes} dishes total</p>
          ${menuHTML}
        </div>

        <div style="background:#f5f0e8;padding:16px 32px;border-top:1px solid #ece8e0;">
          <p style="font-size:12px;color:#a0998a;margin:0;">
            Submitted via the MGH Menu Builder. Hit Reply to respond directly to ${contactName}.
          </p>
        </div>

      </div>
      </body></html>
    `,
  };

  // ════════════════════════════════════════════
  // EMAIL 2 — CLIENT CONFIRMATION
  // Warm, branded, professional thank-you
  // reply-to is the owner so client can respond
  // ════════════════════════════════════════════
  const clientEmail = {
    from: FROM_EMAIL,
    to: contactEmail,
    replyTo: OWNER_EMAIL,
    subject: `Your Menu Request — Mlangeni Grand Hospitality`,
    html: `
      <!DOCTYPE html><html>
      <body style="font-family:Georgia,serif;background:#faf9f6;margin:0;padding:0;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #ece8e0;">

        <div style="background:#1a1a1a;padding:28px 32px;">
          <h1 style="color:#c9a96e;font-size:20px;margin:0;letter-spacing:0.05em;">Mlangeni Grand Hospitality</h1>
          <p style="color:#a0998a;font-size:11px;margin:6px 0 0;letter-spacing:0.12em;text-transform:uppercase;">Menu Quote Request Confirmed</p>
        </div>

        <div style="padding:32px 32px 0;">
          <h2 style="font-family:Georgia,serif;font-size:22px;color:#1a1a1a;font-weight:400;margin:0 0 12px;">
            Thank you, ${contactName}.
          </h2>
          <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 24px;">
            We have received your menu request and our team is reviewing your selections.
            You will receive a full personalised price quote within <strong>24 hours</strong>.
          </p>
        </div>

        <div style="margin:0 32px;background:#f5f0e8;border-radius:10px;padding:20px 24px;">
          <p style="font-size:11px;color:#c9a96e;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;font-weight:600;">Your Event Summary</p>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr><td style="color:#888;padding:4px 0;width:120px;">Date</td><td style="color:#1a1a1a;font-weight:500;">${formattedDate}</td></tr>
            <tr><td style="color:#888;padding:4px 0;">Guests</td><td style="color:#1a1a1a;font-weight:500;">${guests} people</td></tr>
            <tr><td style="color:#888;padding:4px 0;">Courses</td><td style="color:#1a1a1a;font-weight:500;">${cats.length} courses · ${totalDishes} dishes</td></tr>
            ${notes ? `<tr><td style="color:#888;padding:4px 0;vertical-align:top;">Notes</td><td style="color:#1a1a1a;">${notes}</td></tr>` : ""}
          </table>
        </div>

        <div style="padding:24px 32px 0;">
          <p style="font-size:11px;color:#c9a96e;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;font-weight:600;">Your Menu Selections</p>
          ${menuHTML}
        </div>

        <div style="padding:28px 32px;">
          <p style="font-size:13px;color:#888;line-height:1.7;margin:0;">
            If you have any questions in the meantime, simply reply to this email
            and our team will get back to you promptly.
          </p>
          <p style="font-size:13px;color:#888;margin:16px 0 0;">
            Warm regards,<br/>
            <strong style="color:#1a1a1a;">Mlangeni Grand Hospitality</strong>
          </p>
        </div>

        <div style="background:#1a1a1a;padding:16px 32px;">
          <p style="font-size:11px;color:#555;margin:0;letter-spacing:0.06em;">
            MLANGENI GRAND HOSPITALITY · PREMIUM CATERING & EVENTS
          </p>
        </div>

      </div>
      </body></html>
    `,
  };

  // ── Send both emails in parallel ───────────
  try {
    await Promise.all([
      resend.emails.send(ownerEmail),
      resend.emails.send(clientEmail),
    ]);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
