"use client";

import { useState, CSSProperties } from "react";
import { Mail, ArrowRight, Check, Loader2 } from "lucide-react";
import { useToast } from "@/lib/toast";
import { Reveal } from "../motion/Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot — must stay empty
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setErr("Please enter a valid email");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      toast("You're subscribed — welcome aboard.", "success");
    } catch {
      setStatus("error");
      setErr("Couldn't subscribe. Please try again.");
      toast("Couldn't subscribe. Please try again.", "error");
    }
  };

  return (
    <section style={{ background: "var(--band)", padding: "64px 0" }}>
      <Reveal as="div" className="wrap" style={card}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <p className="eyebrow">Newsletter</p>
          <h2 className="h-section" style={{ fontSize: 30 }}>
            New listings, before everyone else
          </h2>
          <p className="lead" style={{ marginTop: 12 }}>
            A short monthly note — fresh homes across Armenia and the occasional market insight. No noise.
          </p>
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          {status === "done" ? (
            <div style={success}>
              <span style={successIcon}>
                <Check size={18} />
              </span>
              <div>
                <div style={{ fontWeight: 600 }}>You&apos;re on the list</div>
                <div className="t-meta">We&apos;ll be in touch with the good stuff.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              {/* Honeypot: hidden from real users, catches bots. */}
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
              <div style={inputRow}>
                <div style={inputWrap}>
                  <Mail size={17} color="var(--fg2)" style={{ flexShrink: 0 }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    aria-label="Email address"
                    style={input}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-pill" disabled={status === "sending"} style={{ justifyContent: "center" }}>
                  {status === "sending" ? <Loader2 size={16} className="spin" /> : <ArrowRight size={16} />}
                  Subscribe
                </button>
              </div>
              {err && (
                <span style={errStyle} role="alert">
                  {err}
                </span>
              )}
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}

const card: CSSProperties = { display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" };
const inputRow: CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap" };
const inputWrap: CSSProperties = { flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 9, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-pill)", padding: "0 16px" };
const input: CSSProperties = { flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 14.5, color: "var(--fg1)", padding: "13px 0" };
const errStyle: CSSProperties = { display: "block", fontSize: 12.5, color: "#C0392B", marginTop: 8 };
const success: CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: "var(--radius-card)", background: "var(--surface)", border: "1px solid var(--accent)" };
const successIcon: CSSProperties = { width: 36, height: 36, borderRadius: 999, background: "var(--success)", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 };
