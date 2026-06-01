// Re-mounts on every navigation, giving a subtle cross-page fade.
// Opacity-only (no transform) so it never breaks the fixed nav / floating buttons.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-fade" id="main-content" tabIndex={-1}>
      {children}
    </div>
  );
}
