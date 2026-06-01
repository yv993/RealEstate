"use client";

import { useEffect, CSSProperties } from "react";
import Link from "next/link";

// Brand-styled error boundary. Shown if a route throws at runtime.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div style={wrap}>
      <p className="eyebrow">Something went wrong</p>
      <h1 className="h-hero" style={{ fontSize: "clamp(34px, 5vw, 52px)", marginBottom: 12 }}>
        A small hiccup on our end
      </h1>
      <p className="lead" style={{ marginBottom: 24 }}>
        We couldn&apos;t load this page just now. Please try again — and if it keeps happening, our team is a call away.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={reset} className="btn btn-primary btn-pill">
          Try again
        </button>
        <Link href="/" className="btn btn-outline btn-pill">
          Back home
        </Link>
      </div>
    </div>
  );
}

const wrap: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: 8,
  padding: "40px 24px",
  background: "var(--bg)",
  color: "var(--fg1)",
  maxWidth: 560,
  margin: "0 auto",
};
