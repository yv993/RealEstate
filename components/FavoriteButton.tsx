"use client";

import { CSSProperties } from "react";
import { useFavorites } from "@/lib/favorites";
import { useToast } from "@/lib/toast";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill={filled ? "var(--accent)" : "none"}
      stroke={filled ? "var(--accent)" : "#1A1A1A"}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z" />
    </svg>
  );
}

/** Tiny client island: the only interactive bit of an otherwise server-rendered card. */
export function FavoriteButton({ id }: { id: number }) {
  const { isFavorite, toggle, ready } = useFavorites();
  const { toast } = useToast();
  const fav = ready && isFavorite(id);
  return (
    <button
      style={style}
      onClick={(e) => {
        e.preventDefault();
        toggle(id);
        toast(fav ? "Removed from saved" : "Saved to your shortlist", fav ? "info" : "success");
      }}
      aria-label={fav ? "Remove from saved" : "Save property"}
      aria-pressed={fav}
    >
      <HeartIcon filled={fav} />
    </button>
  );
}

const style: CSSProperties = {
  position: "absolute",
  top: 14,
  right: 14,
  width: 34,
  height: 34,
  borderRadius: 999,
  border: 0,
  background: "rgba(255,255,255,0.9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  backdropFilter: "blur(4px)",
  zIndex: 2,
};
