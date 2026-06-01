import { Nav } from "@/components/Nav";

export default function Loading() {
  return (
    <>
      <Nav active="Property List" />
      <div className="catalog-section" style={{ paddingTop: "calc(var(--header-h) + 60px)" }}>
        <div className="skeleton" style={{ height: 80, borderRadius: 14, maxWidth: 1280, margin: "0 auto 32px" }} />
        <div className="cat-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 320, borderRadius: 16 }} />
          ))}
        </div>
      </div>
    </>
  );
}
