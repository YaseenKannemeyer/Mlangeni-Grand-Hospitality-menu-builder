// api/send-quote.js
// ─────────────────────────────────────────────
// Vercel serverless function — runs on the SERVER only.
// Never imported by React. Lives in the /api folder at project root.
// ─────────────────────────────────────────────
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST
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

  // Basic server-side validation
  if (!contactName || !contactEmail || !guests || !eventDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Build the menu summary HTML
  const cats = [
    { label: "Starters", items: selections.starters || [] },
    { label: "Mains", items: selections.mains || [] },
    { label: "Desserts", items: selections.desserts || [] },
    { label: "Beverages", items: selections.beverages || [] },
  ].filter((c) => c.items.length > 0);

  const menuHTML = cats
    .map(
      (c) => `
    <h3 style="color:#c9a96e; font-size:13px; letter-spacing:0.08em; text-transform:uppercase; margin:16px 0 6px;">${c.label}</h3>
    <ul style="margin:0; padding-left:18px;">
      ${c.items
        .map(
          (i) => `
        <li style="font-size:14px; color:#333; padding:3px 0;">
          ${i.name}
          ${i.tags && i.tags.length > 0 ? `<span style="font-size:11px; color:#888;"> — ${i.tags.join(", ")}</span>` : ""}
        </li>
      `,
        )
        .join("")}
    </ul>
  `,
    )
    .join("");

  const formattedDate = new Date(eventDate + "T12:00:00").toLocaleDateString(
    "en-ZA",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // ← change to your verified Resend domain
      to: "yaseenkannemeyer@gmail.com", // ← your inbox
      replyTo: contactEmail, // ← reply goes straight to the client
      subject: `New Quote Request — ${contactName} | ${guests} guests | ${formattedDate}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Georgia, serif; background: #faf9f6; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #ece8e0;">

            <!-- Header -->
            <div style="background: #1a1a1a; padding: 24px 32px;">
              <h1 style="color: #c9a96e; font-size: 22px; margin: 0; letter-spacing: 0.05em;">Élara Catering</h1>
              <p style="color: #a0998a; font-size: 11px; margin: 4px 0 0; letter-spacing: 0.12em; text-transform: uppercase;">New Menu Quote Request</p>
            </div>

            <!-- Contact Details -->
            <div style="padding: 28px 32px 0;">
              <h2 style="font-size: 16px; color: #1a1a1a; margin: 0 0 16px; font-weight: 600;">Client Details</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="color: #888; padding: 5px 0; width: 140px;">Name</td><td style="color: #1a1a1a; font-weight: 500;">${contactName}</td></tr>
                <tr><td style="color: #888; padding: 5px 0;">Email</td><td style="color: #1a1a1a;"><a href="mailto:${contactEmail}" style="color: #c9a96e;">${contactEmail}</a></td></tr>
                <tr><td style="color: #888; padding: 5px 0;">Phone</td><td style="color: #1a1a1a;">${contactPhone || "Not provided"}</td></tr>
              </table>
            </div>

            <!-- Event Details -->
            <div style="padding: 24px 32px 0;">
              <h2 style="font-size: 16px; color: #1a1a1a; margin: 0 0 16px; font-weight: 600;">Event Details</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="color: #888; padding: 5px 0; width: 140px;">Guests</td><td style="color: #1a1a1a; font-weight: 500;">${guests} people</td></tr>
                <tr><td style="color: #888; padding: 5px 0;">Date</td><td style="color: #1a1a1a; font-weight: 500;">${formattedDate}</td></tr>
                <tr><td style="color: #888; padding: 5px 0; vertical-align:top;">Notes</td><td style="color: #1a1a1a;">${notes || "None provided"}</td></tr>
              </table>
            </div>

            <!-- Menu Selections -->
            <div style="padding: 24px 32px; border-top: 1px solid #ece8e0; margin-top: 24px;">
              <h2 style="font-size: 16px; color: #1a1a1a; margin: 0 0 8px; font-weight: 600;">Menu Selections</h2>
              ${menuHTML}
            </div>

            <!-- Footer -->
            <div style="background: #f5f0e8; padding: 16px 32px; border-top: 1px solid #ece8e0;">
              <p style="font-size: 12px; color: #a0998a; margin: 0;">
                This request was submitted via the Élara Catering Menu Builder.
                Reply directly to this email to respond to ${contactName}.
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
