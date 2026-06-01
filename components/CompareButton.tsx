"use client";

import { CSSProperties } from "react";
import { Scale } from "lucide-react";
import { useCompare } from "@/lib/compare";
import { useToast } from "@/lib/toast";

/** Tiny client island: add/remove a card from the compare set. */
export function CompareButton({ id }: { id: number }) {
  const { has, toggle, full, ready } = useCompare();
  const { toast } = useToast();
  const active = ready && has(id);
  const disabled = ready && full && !active;
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (disabled) {
          toast("You can compare up to 3 properties", "info");
          return;
        }
        toggle(id);
        toast(active ? "Removed from compare" : "Added to compare", active ? "info" : "success");
      }}
      aria-label={active ? "Remove from compare" : "Add to compare"}
      aria-pressed={active}
      title={disabled ? "Compare up to 3 properties" : active ? "Remove from compare" : "Add to compare"}
      style={{ ...style, ...(active ? styleOn : {}), opacity: disabled ? 0.45 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
    >
      <Scale size={15} />
    </button>
  );
}

const style: CSSProperties = {
  position: "absolute",
  top: 54,
  right: 14,
  width: 34,
  height: 34,
  borderRadius: 999,
  border: 0,
  background: "rgba(255,255,255,0.9)",
  color: "#1A1A1A",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(4px)",
  zIndex: 2,
};

const styleOn: CSSProperties = { background: "var(--accent)", color: "#fff" };
