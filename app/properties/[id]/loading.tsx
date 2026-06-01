import { Nav } from "@/components/Nav";

export default function Loading() {
  return (
    <>
      <Nav active="Property List" />
      <div className="wrap" style={{ paddingTop: "calc(var(--header-h) + 40px)", paddingBottom: 80 }}>
        <div className="pd-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40 }}>
          <div>
            <div className="skeleton" style={{ aspectRatio: "16 / 11", borderRadius: 16 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginTop: 12 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ aspectRatio: "4 / 3", borderRadius: 12 }} />
              ))}
            </div>
          </div>
          <div className="skeleton" style={{ height: 420, borderRadius: 16 }} />
        </div>
      </div>
    </>
  );
}
