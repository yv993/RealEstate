"use client";

import { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

/** Quick "I'm interested" action on a card — jumps to the listing's inquiry form. */
export function InterestButton({ id }: { id: number }) {
  const router = useRouter();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/properties/${id}#inquire`);
      }}
      style={style}
      aria-label="I'm interested in this property"
    >
      <MessageSquare size={14} />
      I&apos;m interested
    </button>
  );
}

const style: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  width: "100%",
  justifyContent: "center",
  marginTop: 14,
  padding: "10px 14px",
  borderRadius: "var(--radius-btn)",
  border: "1px solid var(--accent)",
  background: "transparent",
  color: "var(--accent)",
  fontFamily: "var(--font-sans)",
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 200ms var(--ease)",
};
