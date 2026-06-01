"use client";

import { useEffect, useRef, useState, ReactNode, CSSProperties } from "react";
import { Phone, Mail, MapPin, Check, ArrowUpRight } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useToast } from "@/lib/toast";
import { Reveal } from "../motion/Reveal";

type FormState = { name: string; email: string; phone: string; interest: string; message: string };

const METHODS = [
  { Icon: Phone, h: "Call us", t: "(+374) 10 539 853", s: "Mon–Sat, 9am–7pm" },
  { Icon: Mail, h: "Email us", t: "hello@evergreen.am", s: "We reply within a day" },
  { Icon: MapPin, h: "Visit us", t: "12 Northern Avenue", s: "Yerevan, Armenia" },
];

function Field({ label, err, children }: { label: string; err?: string; children: ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={ctStyles.fieldLabel}>{label}</span>
      {children}
      {err && (
        <span style={ctStyles.err} role="alert">
          {err}
        </span>
      )}
    </label>
  );
}

export function ContactBody() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", interest: "Buying", message: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // Validate a single field on blur (ui-ux-pro-max: validate on blur, not only submit).
  const validateField = (k: keyof FormState) => {
    setErrors((prev) => {
      const er = { ...prev };
      if (k === "name") form.name.trim() ? delete er.name : (er.name = "Please enter your name");
      if (k === "email") /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) ? delete er.email : (er.email = "Enter a valid email");
      if (k === "message") form.message.trim() ? delete er.message : (er.message = "Tell us a little about what you need");
      return er;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const er: Partial<FormState> = {};
    if (!form.name.trim()) er.name = "Please enter your name";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) er.email = "Enter a valid email";
    if (!form.message.trim()) er.message = "Tell us a little about what you need";
    setErrors(er);
    if (Object.keys(er).length > 0) return;

    setSending(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: `[${form.interest}] ${form.message}`,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSent(true);
      toast("Message sent — an advisor will be in touch.", "success");
    } catch {
      setSubmitError("We couldn't send your message. Please try again or call us.");
      toast("Couldn't send your message. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (sent && successRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        successRef.current.children,
        { opacity: 0, y: 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.6)", stagger: 0.08 }
      );
    }
  }, [sent]);

  return (
    <section className="contact-section">
      <div className="contact-grid" style={ctStyles.grid}>
        <Reveal style={ctStyles.left} x={-24}>
          <p className="eyebrow">Get in touch</p>
          <h2 className="h-section" style={{ fontSize: 34 }}>
            Let&apos;s find your next address
          </h2>
          <p className="lead" style={{ marginTop: 14 }}>
            Tell us what you&apos;re looking for. A dedicated advisor will reach out — no pressure, no
            clutter, just a calm conversation about what&apos;s next.
          </p>
          <div style={ctStyles.methods}>
            {METHODS.map((m) => (
              <div key={m.h} style={ctStyles.method}>
                <span style={ctStyles.mIcon}>
                  <m.Icon size={20} />
                </span>
                <div>
                  <div className="t-label" style={{ color: "var(--fg2)" }}>{m.h}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, margin: "2px 0" }}>{m.t}</div>
                  <div className="t-meta">{m.s}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} style={ctStyles.formCard} x={24}>
          {sent ? (
            <div ref={successRef} style={ctStyles.success}>
              <span style={ctStyles.successIcon}>
                <Check size={28} />
              </span>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "18px 0 8px" }}>
                Thank you, {form.name.split(" ")[0]}.
              </h3>
              <p className="t-meta" style={{ maxWidth: 320, margin: "0 auto" }}>
                Your message is on its way. An advisor will be in touch shortly.
              </p>
              <button
                className="btn btn-outline btn-pill"
                style={{ marginTop: 22 }}
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", phone: "", interest: "Buying", message: "" });
                }}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 20px" }}>Send us a message</h3>
              <Field label="Full name" err={errors.name}>
                <input className="field" style={ctStyles.input} value={form.name} placeholder="Your name" onChange={(e) => set("name", e.target.value)} onBlur={() => validateField("name")} />
              </Field>
              <div className="ct-row" style={ctStyles.row2}>
                <Field label="Email" err={errors.email}>
                  <input className="field" style={ctStyles.input} value={form.email} placeholder="you@email.com" onChange={(e) => set("email", e.target.value)} onBlur={() => validateField("email")} />
                </Field>
                <Field label="Phone (optional)">
                  <input className="field" style={ctStyles.input} value={form.phone} placeholder="(+1) 000-000" onChange={(e) => set("phone", e.target.value)} />
                </Field>
              </div>
              <Field label="I'm interested in">
                <div style={ctStyles.segs}>
                  {["Buying", "Selling", "Investing", "Just looking"].map((o) => (
                    <button
                      type="button"
                      key={o}
                      onClick={() => set("interest", o)}
                      style={{ ...ctStyles.seg, ...(form.interest === o ? ctStyles.segOn : {}) }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Message" err={errors.message}>
                <textarea
                  className="field"
                  style={{ ...ctStyles.input, minHeight: 110, resize: "vertical", fontFamily: "var(--font-sans)" }}
                  value={form.message}
                  placeholder="What are you looking for?"
                  onChange={(e) => set("message", e.target.value)}
                  onBlur={() => validateField("message")}
                />
              </Field>
              {submitError && (
                <span style={{ ...ctStyles.err, marginBottom: 10 }} role="alert">
                  {submitError}
                </span>
              )}
              <button type="submit" disabled={sending} className="btn btn-primary btn-pill" style={{ width: "100%", justifyContent: "center", marginTop: 6, opacity: sending ? 0.7 : 1 }}>
                {sending ? "Sending…" : "Send Message"}
                <ArrowUpRight size={16} />
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

const ctStyles: Record<string, CSSProperties> = {
  grid: { display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: 56, alignItems: "start" },
  left: { paddingTop: 6 },
  methods: { display: "flex", flexDirection: "column", gap: 22, marginTop: 34 },
  method: { display: "flex", gap: 16, alignItems: "flex-start" },
  mIcon: { width: 48, height: 48, borderRadius: 12, background: "var(--accent-tint)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 },
  formCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: 34, boxShadow: "var(--shadow-md)" },
  fieldLabel: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--fg1)", marginBottom: 7 },
  input: { width: "100%", fontSize: 14.5 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  segs: { display: "flex", gap: 8, flexWrap: "wrap" },
  seg: { padding: "9px 15px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500, color: "var(--fg2)", cursor: "pointer", transition: "all 200ms var(--ease)" },
  segOn: { background: "var(--accent-tint)", border: "1px solid var(--accent)", color: "var(--accent-hover)" },
  err: { display: "block", fontSize: 12.5, color: "#C0392B", marginTop: 6 },
  success: { textAlign: "center", padding: "40px 10px" },
  successIcon: { width: 64, height: 64, borderRadius: 999, background: "var(--success)", color: "#fff", display: "inline-grid", placeItems: "center" },
};
