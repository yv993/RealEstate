export default function Loading() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 24px 60px" }}>
      <div className="skeleton" style={{ height: 36, width: 220, borderRadius: 10, marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 320, borderRadius: 16 }} />
    </div>
  );
}
