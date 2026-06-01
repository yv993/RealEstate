"use client";

import dynamic from "next/dynamic";

// Lazy-load the optional custom cursor on the client only, so it never adds to the
// initial server-rendered HTML or the critical JS bundle.
const Cursor = dynamic(() => import("./Cursor").then((m) => m.Cursor), { ssr: false });

export function CursorLoader() {
  return <Cursor />;
}
