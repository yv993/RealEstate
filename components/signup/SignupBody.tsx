"use client";

import { useEffect, useRef, useState, ReactNode, CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Lock, Check, ArrowUpRight, ShieldCheck } from "lucide-react";
import { IMG } from "@/lib/data";
import { BLUR_DATA_URL } from "@/lib/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type FormState = { name: string; email: string; password: string; agree: boolean };

function Field({ label, err, children }: { label: string; err?: string; children: ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={suStyles.fieldLabel}>{label}</span>
      {children}
      {err && (
        <span style={suStyles.err} role="alert">
          {err}
        </span>
      )}
    </label>
  );
}

export function SignupBody() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "", agree: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((p) => ({ ...p, [k]: v }));

  // Entrance animation for the whole panel.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".su-aside", { opacity: 0, x: 40, duration: 0.9 }, 0)
        .from(".su-anim", { opacity: 0, y: 22, duration: 0.7, stagger: 0.08 }, 0.2);
    }, el);
    return () => ctx.revert();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!form.name.trim()) er.name = "Please enter your name";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) er.email = "Enter a valid email";
    if (form.password.length < 6) er.password = "At least 6 characters";
    if (!form.agree) er.agree = "Please accept the terms to continue";
    setErrors(er);
    if (Object.keys(er).length === 0) setDone(true);
  };

  return (
    <div ref={rootRef} className="signup-grid" style={suStyles.grid}>
      {/* Form side */}
      <div style={suStyles.formSide}>
        <div style={suStyles.formInner}>
          {done ? (
            <div style={suStyles.success}>
              <span style={suStyles.successIcon}>
                <Check size={30} />
              </span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 30, margin: "20px 0 8px" }}>
                Welcome aboard, {form.name.split(" ")[0]}.
              </h2>
              <p className="t-meta" style={{ maxWidth: 340, margin: "0 auto" }}>
                Your account is ready. An advisor will help you start curating your first collection.
              </p>
              <Link href="/properties" className="btn btn-primary btn-pill" style={{ marginTop: 24 }}>
                Browse properties
                <ArrowUpRight size={16} />
              </Link>
            </div>
          ) : (
            <>
              <p className="eyebrow su-anim">Create account</p>
              <h1 className="h-hero su-anim" style={{ fontSize: 38, marginBottom: 10 }}>
                Join EverGreen
              </h1>
              <p className="lead su-anim" style={{ marginBottom: 26 }}>
                Save listings, get curated matches, and book private viewings — all in one calm place.
              </p>

              <div className="su-anim" style={suStyles.socialRow}>
                {[
                  { n: "google", l: "Google" },
                  { n: "apple", l: "Apple" },
                ].map((s) => (
                  <button key={s.n} type="button" style={suStyles.socialBtn}>
                    <Image src={`https://cdn.simpleicons.org/${s.n}/1A1A1A`} width={18} height={18} alt={s.l} unoptimized />
                    {s.l}
                  </button>
                ))}
              </div>
              <div className="su-anim" style={suStyles.divider}>
                <span style={suStyles.dividerLine} />
                <span style={{ fontSize: 13, color: "var(--fg2)" }}>or sign up with email</span>
                <span style={suStyles.dividerLine} />
              </div>

              <form onSubmit={submit} noValidate className="su-anim">
                <Field label="Full name" err={errors.name}>
                  <div style={suStyles.inputWrap}>
                    <User size={17} color="var(--fg2)" style={suStyles.inputIcon} />
                    <input className="field" style={suStyles.input} value={form.name} placeholder="Your name" onChange={(e) => set("name", e.target.value)} />
                  </div>
                </Field>
                <Field label="Email" err={errors.email}>
                  <div style={suStyles.inputWrap}>
                    <Mail size={17} color="var(--fg2)" style={suStyles.inputIcon} />
                    <input className="field" style={suStyles.input} value={form.email} placeholder="you@email.com" onChange={(e) => set("email", e.target.value)} />
                  </div>
                </Field>
                <Field label="Password" err={errors.password}>
                  <div style={suStyles.inputWrap}>
                    <Lock size={17} color="var(--fg2)" style={suStyles.inputIcon} />
                    <input type="password" className="field" style={suStyles.input} value={form.password} placeholder="At least 6 characters" onChange={(e) => set("password", e.target.value)} />
                  </div>
                </Field>

                <label style={suStyles.agreeRow}>
                  <input type="checkbox" checked={form.agree} onChange={(e) => set("agree", e.target.checked)} style={{ accentColor: "var(--accent)", width: 16, height: 16, marginTop: 2 }} />
                  <span style={{ fontSize: 13.5, color: "var(--fg2)", lineHeight: 1.5 }}>
                    I agree to EverGreen&apos;s <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
                  </span>
                </label>
                {errors.agree && (
                  <span style={{ ...suStyles.err, marginTop: -6, marginBottom: 10 }} role="alert">
                    {errors.agree}
                  </span>
                )}

                <button type="submit" className="btn btn-primary btn-pill" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
                  Create account
                  <ArrowUpRight size={16} />
                </button>
              </form>

              <p className="su-anim t-meta" style={{ textAlign: "center", marginTop: 20 }}>
                Already have an account? <Link href="/contact">Contact us</Link>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image aside */}
      <aside className="su-aside signup-aside" style={suStyles.aside}>
        <Image src={IMG("1600585154340-be6161a56a0c", 1200)} alt="" fill sizes="50vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} style={suStyles.asideImg} />
        <div style={suStyles.asideScrim} />
        <div style={suStyles.asideContent}>
          <span style={suStyles.asideBadge}>
            <ShieldCheck size={15} />
            Trusted by 500+ families
          </span>
          <h2 style={suStyles.asideHead}>
            Your next home is closer than you think.
          </h2>
          <p style={suStyles.asideSub}>
            Join a calm, curated way to buy — no clutter, no pressure, just the right home.
          </p>
        </div>
      </aside>
    </div>
  );
}

const suStyles: Record<string, CSSProperties> = {
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - var(--header-h))", maxWidth: "var(--content-max)", margin: "0 auto" },
  formSide: { display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 32px" },
  formInner: { width: "100%", maxWidth: 420 },
  socialRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 },
  socialBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "11px 14px", borderRadius: "var(--radius-btn)", border: "1px solid var(--border)", background: "var(--surface)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--fg1)", cursor: "pointer", transition: "all 200ms var(--ease)" },
  divider: { display: "flex", alignItems: "center", gap: 14, margin: "4px 0 22px" },
  dividerLine: { flex: 1, height: 1, background: "var(--border)" },
  fieldLabel: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--fg1)", marginBottom: 7 },
  inputWrap: { position: "relative" },
  inputIcon: { position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" },
  input: { width: "100%", fontSize: 14.5, paddingLeft: 38 },
  agreeRow: { display: "flex", gap: 10, alignItems: "flex-start", margin: "4px 0 14px", cursor: "pointer" },
  err: { display: "block", fontSize: 12.5, color: "#C0392B", marginTop: 6 },
  success: { textAlign: "center", padding: "20px 0" },
  successIcon: { width: 68, height: 68, borderRadius: 999, background: "var(--success)", color: "#fff", display: "inline-grid", placeItems: "center" },
  aside: { position: "relative", overflow: "hidden", borderRadius: "0 0 0 0" },
  asideImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "kenburns 22s var(--ease) infinite alternate" },
  asideScrim: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,18,14,0.30), rgba(15,18,14,0.72))" },
  asideContent: { position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 48, color: "#fff" },
  asideBadge: { display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start", padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", fontSize: 13, fontWeight: 500, marginBottom: 18 },
  asideHead: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(26px, 2.4vw, 36px)", lineHeight: 1.18, letterSpacing: "-0.02em", margin: 0, maxWidth: 380 },
  asideSub: { color: "rgba(255,255,255,0.85)", fontSize: 15.5, marginTop: 14, maxWidth: 360 },
};
