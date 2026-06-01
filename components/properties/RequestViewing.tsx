"use client";

import { useState, CSSProperties } from "react";
import { CalendarCheck, Check, Loader2 } from "lucide-react";
import { useToast } from "@/lib/toast";
import { track } from "@/lib/track";
import { Magnetic } from "../motion/Magnetic";

type Status = "idle" | "open" | "sending" | "sent" | "error";

export function RequestViewing({
  propertyId,
  propertyTitle,
  isRent = false,
}: {
  propertyId: number;
  propertyTitle: string;
  isRent?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "" });
  const [error, setError] = useState("");
  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const { toast } = useToast();
  const ctaLabel = isRent ? "Book a tour" : "Book a viewing";
  const today = new Date().toISOString().split("T")[0];
  const TIMES = ["09:00", "11:00", "13:00", "15:00", "17:00"];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your name");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return setError("Enter a valid email");
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: `${isRent ? "Tour" : "Viewing"} request for "${propertyTitle}".${
            form.date ? ` Preferred: ${form.date}${form.time ? " at " + form.time : ""}.` : ""
          }`,
          property_id: propertyId,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      toast(`${isRent ? "Tour" : "Viewing"} request sent — we'll confirm shortly.`, "success");
      track("viewing_requested", { property_id: propertyId, type: isRent ? "tour" : "viewing" });
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again or call us.");
      toast("Couldn't send your request. Please try again.", "error");
    }
  };

  if (status === "sent") {
    return (
      <div style={rvStyles.success}>
        <span style={rvStyles.successIcon}>
          <Check size={18} />
        </span>
        <div>
          <div style={{ fontWeight: 600 }}>Request received</div>
          <div className="t-meta">An advisor will reach out to schedule your viewing.</div>
        </div>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <Magnetic style={{ width: "100%" }}>
        <button className="btn btn-primary btn-pill" style={{ width: "100%", justifyContent: "center" }} onClick={() => setStatus("open")}>
          <CalendarCheck size={16} />
          {ctaLabel}
        </button>
      </Magnetic>
    );
  }

  return (
    <form onSubmit={submit} style={rvStyles.form}>
      <input className="field" style={rvStyles.input} placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
      <input className="field" style={rvStyles.input} placeholder="you@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
      <input className="field" style={rvStyles.input} placeholder="Phone (optional)" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      <span style={rvStyles.label}>Preferred date &amp; time</span>
      <div style={rvStyles.row2}>
        <input type="date" min={today} className="field" style={rvStyles.input} value={form.date} onChange={(e) => set("date", e.target.value)} aria-label="Preferred date" />
        <select className="field" style={rvStyles.input} value={form.time} onChange={(e) => set("time", e.target.value)} aria-label="Preferred time">
          <option value="">Any time</option>
          {TIMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      {error && (
        <span style={rvStyles.err} role="alert">
          {error}
        </span>
      )}
      <button type="submit" className="btn btn-primary btn-pill" style={{ width: "100%", justifyContent: "center" }} disabled={status === "sending"}>
        {status === "sending" ? <Loader2 size={16} className="spin" /> : <CalendarCheck size={16} />}
        {status === "sending" ? "Sending…" : "Confirm request"}
      </button>
    </form>
  );
}

const rvStyles: Record<string, CSSProperties> = {
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: { width: "100%", fontSize: 14.5 },
  label: { fontSize: 12.5, fontWeight: 600, color: "var(--fg2)", marginTop: 2 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  err: { fontSize: 12.5, color: "#C0392B" },
  success: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: "var(--radius-btn)", background: "var(--accent-tint)", border: "1px solid var(--accent)" },
  successIcon: { width: 34, height: 34, borderRadius: 999, background: "var(--success)", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 },
};
