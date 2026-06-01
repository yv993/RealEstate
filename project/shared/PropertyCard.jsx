// EverGreen — PropertyCard
function fmtPrice(p) { return "$" + p.toLocaleString("en-US"); }

function HeartIcon({ filled }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? "var(--accent)" : "none"}
      stroke={filled ? "var(--accent)" : "#1A1A1A"} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z" />
    </svg>
  );
}

function CardMeta({ icon, children }) {
  return (
    <span style={pcStyles.meta}>
      <i data-lucide={icon} style={{ width: 16, height: 16 }}></i>{children}
    </span>
  );
}

function PropertyCard({ p }) {
  const [fav, setFav] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const badgeClass = p.badge === "Available" ? "badge badge-success"
    : p.badge === "New" ? "badge" : "badge badge-dark";
  const badgeStyle = p.badge === "New"
    ? { background: "var(--surface)", color: "var(--fg1)", border: "1px solid var(--border)" } : {};

  return (
    <a href="properties.html" style={{ textDecoration: "none" }}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <article style={{ ...pcStyles.card, ...(hover ? pcStyles.cardHover : {}) }}>
        <div style={pcStyles.media}>
          <img src={p.img} alt={p.title} loading="lazy"
               style={{ ...pcStyles.img, ...(hover ? pcStyles.imgHover : {}) }} />
          <span className={badgeClass} style={{ ...pcStyles.badge, ...badgeStyle }}>{p.badge}</span>
          <button style={pcStyles.fav}
            onClick={(e) => { e.preventDefault(); setFav(!fav); }} aria-label="Favorite">
            <HeartIcon filled={fav} />
          </button>
        </div>
        <div style={pcStyles.body}>
          <div style={pcStyles.metaRow}>
            <CardMeta icon="bed-double">{p.beds} Bedrooms</CardMeta>
            <CardMeta icon="bath">{p.baths} Bathroom</CardMeta>
          </div>
          <div style={pcStyles.title}>{p.title}</div>
          <div style={pcStyles.priceRow}>
            <span style={pcStyles.price}>{fmtPrice(p.price)}</span>
            <span style={pcStyles.loc}><i data-lucide="map-pin" style={{ width: 13, height: 13 }}></i>{p.location}</span>
          </div>
        </div>
      </article>
    </a>
  );
}

const pcStyles = {
  card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", overflow: "hidden", boxShadow: "var(--shadow-md)", transition: "transform var(--t-card) var(--ease), box-shadow var(--t-card) var(--ease)" },
  cardHover: { transform: "translateY(-4px)", boxShadow: "var(--shadow-lg)" },
  media: { position: "relative", aspectRatio: "4 / 3", overflow: "hidden", background: "var(--border)" },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 500ms var(--ease)" },
  imgHover: { transform: "scale(1.05)" },
  badge: { position: "absolute", top: 14, left: 14 },
  fav: { position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: 999, border: 0, background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" },
  body: { padding: 18 },
  metaRow: { display: "flex", gap: 18, marginBottom: 10 },
  meta: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--fg2)" },
  title: { fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fg1)" },
  priceRow: { display: "flex", alignItems: "center", gap: 12, marginTop: 8, flexWrap: "wrap" },
  price: { fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg1)" },
  loc: { display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--fg2)" },
};

window.PropertyCard = PropertyCard;
