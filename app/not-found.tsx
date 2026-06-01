import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Page not found — EverGreen" };

export default function NotFound() {
  return (
    <>
      <Nav />
      <div
        className="wrap"
        style={{
          minHeight: "70vh",
          paddingTop: "calc(var(--header-h) + 40px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 14,
        }}
      >
        <p className="eyebrow">Error 404</p>
        <h1 className="h-hero" style={{ fontSize: "clamp(40px, 6vw, 64px)" }}>
          Page not found
        </h1>
        <p className="lead">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back home.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/" className="btn btn-primary btn-pill">
            Back home
          </Link>
          <Link href="/properties" className="btn btn-outline btn-pill">
            Browse properties
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
