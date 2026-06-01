// Server-side error monitoring via Sentry, fully gated on SENTRY_DSN.
// With no DSN set (e.g. locally), this is a complete no-op.

// Warn (never crash) about missing recommended env vars at server startup.
function warnMissingEnv() {
  const recommended: Record<string, string> = {
    NEXT_PUBLIC_SUPABASE_URL: "database reads/writes (falls back to static data)",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "public DB reads + admin login",
    SUPABASE_SERVICE_ROLE_KEY: "saving leads/subscribers + admin writes",
    NEXT_PUBLIC_SITE_URL: "canonical URLs, sitemap, OG tags",
    RESEND_API_KEY: "sending lead/newsletter emails (skipped if absent)",
  };
  const missing = Object.keys(recommended).filter((k) => !process.env[k]);
  if (missing.length) {
    console.warn(
      "[env] Running with reduced functionality. Missing (optional) env vars:\n" +
        missing.map((k) => `  - ${k}: ${recommended[k]}`).join("\n")
    );
  }
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") warnMissingEnv();

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      enabled: true,
    });
  }
}

export async function onRequestError(...args: unknown[]) {
  if (!process.env.SENTRY_DSN) return;
  const Sentry = await import("@sentry/nextjs");
  // @ts-expect-error — forwards Next's error args to Sentry's capture helper.
  Sentry.captureRequestError(...args);
}
