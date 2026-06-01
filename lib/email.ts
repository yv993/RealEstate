import { Resend } from "resend";

const KEY = process.env.RESEND_API_KEY;
// Resend's shared sandbox sender works out of the box; set EMAIL_FROM once you
// verify your own domain in Resend (e.g. "EverGreen <hello@evergreen.am>").
const FROM = process.env.EMAIL_FROM || "EverGreen <onboarding@resend.dev>";
const AGENCY = process.env.AGENCY_EMAIL || "hello@evergreen.am";

export const emailEnabled = () => Boolean(KEY);

async function send(opts: { to: string; subject: string; html: string; replyTo?: string }) {
  if (!KEY) return { sent: false, reason: "no-key" as const };
  try {
    const resend = new Resend(KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });
    if (error) {
      console.log("[email] send error:", error.message);
      return { sent: false, reason: "error" as const };
    }
    return { sent: true as const };
  } catch (e) {
    console.log("[email] exception:", e);
    return { sent: false, reason: "exception" as const };
  }
}

const shell = (inner: string) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A">
    <div style="font-size:22px;font-weight:700;color:#B08D57;margin-bottom:16px">EverGreen</div>
    ${inner}
    <hr style="border:none;border-top:1px solid #EAEAEA;margin:24px 0"/>
    <div style="font-size:12px;color:#6B6B6B">EverGreen · 12 Northern Avenue, Yerevan, Armenia · (+374) 10 539 853</div>
  </div>`;

export async function notifyLead(lead: { name: string; email: string; phone?: string | null; message: string; property_id?: number | null }) {
  const rows = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone || "—"],
    ["Property", lead.property_id ? `#${lead.property_id}` : "—"],
    ["Message", lead.message || "—"],
  ]
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6B6B6B">${k}</td><td style="padding:6px 0;font-weight:600">${v}</td></tr>`)
    .join("");

  // 1) Notify the agency.
  await send({
    to: AGENCY,
    replyTo: lead.email,
    subject: `New enquiry from ${lead.name}`,
    html: shell(`<h2 style="font-size:18px;margin:0 0 12px">New enquiry</h2><table style="font-size:14px">${rows}</table>`),
  });

  // 2) Auto-reply to the visitor.
  await send({
    to: lead.email,
    subject: "We received your message — EverGreen",
    html: shell(
      `<h2 style="font-size:18px;margin:0 0 12px">Thank you, ${lead.name.split(" ")[0]}.</h2>
       <p style="font-size:14px;line-height:1.6;color:#444">Your message has reached our team and a dedicated advisor will be in touch shortly. In the meantime, feel free to call us at (+374) 10 539 853.</p>`
    ),
  });
}

export async function notifySubscriber(email: string) {
  await send({
    to: AGENCY,
    subject: `New newsletter subscriber: ${email}`,
    html: shell(`<p style="font-size:14px">New subscriber: <strong>${email}</strong></p>`),
  });
  await send({
    to: email,
    subject: "You're subscribed — EverGreen",
    html: shell(
      `<h2 style="font-size:18px;margin:0 0 12px">Welcome aboard.</h2>
       <p style="font-size:14px;line-height:1.6;color:#444">You'll be among the first to hear about new homes across Armenia. No noise — just the good stuff.</p>`
    ),
  });
}
