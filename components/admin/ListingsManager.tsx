"use client";

import { useEffect, useState, CSSProperties } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Upload, Loader2, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Row = {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  beds: number;
  baths: number;
  area: number;
  badge: string;
  img: string;
  description: string;
  gallery: string[];
  features: string[];
  year_built: number;
  garage: number;
  published: boolean;
};

type FormShape = Omit<Row, "id" | "gallery" | "features"> & { id: number | null; featuresText: string };

const BLANK: FormShape = {
  id: null, title: "", location: "", price: 0, type: "Villa", beds: 3, baths: 2, area: 200,
  badge: "For Sale", img: "", description: "", featuresText: "", year_built: 2020, garage: 1, published: true,
};

export function ListingsManager() {
  const supabase = createSupabaseBrowserClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormShape | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.from("properties").select("*").order("id", { ascending: true });
    if (error) setError(error.message);
    else setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  // Refresh the public ISR-cached pages after a mutation.
  const revalidatePublic = () => fetch("/api/revalidate", { method: "POST" }).catch(() => {});

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof FormShape>(k: K, v: FormShape[K]) =>
    setForm((p) => (p ? { ...p, [k]: v } : p));

  const startCreate = () => setForm({ ...BLANK });
  const startEdit = (r: Row) =>
    setForm({ ...r, id: r.id, featuresText: (r.features ?? []).join(", ") });

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("property-images").upload(path, file);
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("property-images").getPublicUrl(path);
      set("img", data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    const features = form.featuresText.split(",").map((s) => s.trim()).filter(Boolean);
    const payload = {
      title: form.title, location: form.location, price: Number(form.price), type: form.type,
      beds: Number(form.beds), baths: Number(form.baths), area: Number(form.area), badge: form.badge,
      img: form.img || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80",
      description: form.description, gallery: form.img ? [form.img] : [], features,
      year_built: Number(form.year_built), garage: Number(form.garage), published: form.published,
    };
    const res = form.id
      ? await supabase.from("properties").update(payload).eq("id", form.id)
      : await supabase.from("properties").insert(payload);
    if (res.error) setError(res.error.message);
    else {
      setForm(null);
      await load();
      revalidatePublic();
    }
    setSaving(false);
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) setError(error.message);
    else {
      await load();
      revalidatePublic();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 className="h-section" style={{ fontSize: 26 }}>
            Listings
          </h1>
          <p className="t-meta" style={{ marginTop: 4 }}>
            {rows.length} {rows.length === 1 ? "property" : "properties"}
          </p>
        </div>
        <button className="btn btn-primary btn-pill" onClick={startCreate}>
          <Plus size={16} />
          Add listing
        </button>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--fg2)" }}>
          <Loader2 size={22} className="spin" />
        </div>
      ) : (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Title", "Location", "Price", "Type", "Status", ""].map((h, i) => (
                  <th key={i} style={styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{r.title}</td>
                  <td style={styles.td}>{r.location}</td>
                  <td style={styles.td}>${Number(r.price).toLocaleString("en-US")}</td>
                  <td style={styles.td}>{r.type}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.pill, ...(r.published ? styles.pillOn : styles.pillOff) }}>
                      {r.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "right", whiteSpace: "nowrap" }}>
                    <button style={styles.iconBtn} onClick={() => startEdit(r)} aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button style={{ ...styles.iconBtn, color: "#C0392B" }} onClick={() => remove(r.id)} aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <div style={styles.overlay} onClick={() => !saving && setForm(null)}>
          <form style={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <div style={styles.modalHead}>
              <h2 style={{ fontSize: 20, fontWeight: 600 }}>{form.id ? "Edit listing" : "New listing"}</h2>
              <button type="button" style={styles.close} onClick={() => setForm(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div style={styles.formGrid}>
              <L label="Title" full>
                <input className="field" style={styles.input} value={form.title} onChange={(e) => set("title", e.target.value)} required />
              </L>
              <L label="Location">
                <input className="field" style={styles.input} value={form.location} onChange={(e) => set("location", e.target.value)} required />
              </L>
              <L label="Price (USD)">
                <input className="field" style={styles.input} type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} required />
              </L>
              <L label="Type">
                <select className="field" style={styles.input} value={form.type} onChange={(e) => set("type", e.target.value)}>
                  {["House", "Villa", "Estate"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </L>
              <L label="Badge">
                <select className="field" style={styles.input} value={form.badge} onChange={(e) => set("badge", e.target.value)}>
                  {["For Sale", "New", "Available"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </L>
              <L label="Beds">
                <input className="field" style={styles.input} type="number" value={form.beds} onChange={(e) => set("beds", Number(e.target.value))} />
              </L>
              <L label="Baths">
                <input className="field" style={styles.input} type="number" value={form.baths} onChange={(e) => set("baths", Number(e.target.value))} />
              </L>
              <L label="Area (m²)">
                <input className="field" style={styles.input} type="number" value={form.area} onChange={(e) => set("area", Number(e.target.value))} />
              </L>
              <L label="Garage">
                <input className="field" style={styles.input} type="number" value={form.garage} onChange={(e) => set("garage", Number(e.target.value))} />
              </L>
              <L label="Year built">
                <input className="field" style={styles.input} type="number" value={form.year_built} onChange={(e) => set("year_built", Number(e.target.value))} />
              </L>
              <L label="Description" full>
                <textarea className="field" style={{ ...styles.input, minHeight: 80, resize: "vertical", fontFamily: "var(--font-sans)" }} value={form.description} onChange={(e) => set("description", e.target.value)} />
              </L>
              <L label="Features (comma separated)" full>
                <input className="field" style={styles.input} value={form.featuresText} placeholder="Hardwood floors, Private garden" onChange={(e) => set("featuresText", e.target.value)} />
              </L>
              <L label="Main image" full>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  {form.img && (
                    <Image src={form.img} alt="" width={72} height={54} unoptimized style={{ objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                  )}
                  <label className="btn btn-outline btn-pill" style={{ cursor: "pointer" }}>
                    {uploading ? <Loader2 size={15} className="spin" /> : <Upload size={15} />}
                    {uploading ? "Uploading…" : "Upload image"}
                    <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                  </label>
                </div>
              </L>
              <L label="" full>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} style={{ accentColor: "var(--accent)", width: 16, height: 16 }} />
                  <span style={{ fontSize: 14 }}>Published (visible on the public site)</span>
                </label>
              </L>
            </div>

            <div style={styles.modalFoot}>
              <button type="button" className="btn btn-ghost" onClick={() => setForm(null)} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-pill" disabled={saving || uploading}>
                {saving ? <Loader2 size={16} className="spin" /> : null}
                {saving ? "Saving…" : form.id ? "Save changes" : "Create listing"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function L({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", gridColumn: full ? "1 / -1" : "auto" }}>
      {label && <span style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{label}</span>}
      {children}
    </label>
  );
}

const styles: Record<string, CSSProperties> = {
  errorBox: { padding: 14, borderRadius: 12, background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.3)", color: "#C0392B", fontSize: 14, marginBottom: 16 },
  tableCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", overflowX: "auto", boxShadow: "var(--shadow-sm)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 680 },
  th: { textAlign: "left", padding: "13px 16px", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--fg2)", borderBottom: "1px solid var(--border)", background: "var(--bg)" },
  tr: { borderBottom: "1px solid var(--border)" },
  td: { padding: "13px 16px", verticalAlign: "middle" },
  pill: { fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999 },
  pillOn: { background: "var(--accent-tint)", color: "var(--accent-hover)" },
  pillOff: { background: "var(--border)", color: "var(--fg2)" },
  iconBtn: { width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg1)", cursor: "pointer", marginLeft: 6, display: "inline-grid", placeItems: "center", verticalAlign: "middle" },
  overlay: { position: "fixed", inset: 0, background: "rgba(15,18,14,0.5)", backdropFilter: "blur(3px)", display: "grid", placeItems: "center", padding: 20, zIndex: 100 },
  modal: { width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", background: "var(--surface)", borderRadius: "var(--radius-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" },
  modalHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--surface)" },
  close: { width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg1)", cursor: "pointer", display: "grid", placeItems: "center" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 24 },
  input: { width: "100%", fontSize: 14 },
  modalFoot: { display: "flex", justifyContent: "flex-end", gap: 12, padding: "16px 24px", borderTop: "1px solid var(--border)", position: "sticky", bottom: 0, background: "var(--surface)" },
};
