import Skeleton from "./Skeleton";

export default function ArticleSkeleton() {
  return (
    <article className="section-wrap" style={{ paddingTop: "var(--space-7)", paddingBottom: "var(--space-9)" }}>
      {/* Back link */}
      <Skeleton width={100} height={14} style={{ marginBottom: "var(--space-6)" }} />

      {/* Article header — centered column */}
      <div style={{ maxWidth: 760, marginInline: "auto", marginBottom: "var(--space-7)" }}>
        <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
          <Skeleton width={64} height={22} radius={999} />
          <Skeleton width={80} height={22} radius={999} />
        </div>
        <Skeleton width="85%" height={48} radius={8} style={{ marginBottom: "var(--space-3)" }} />
        <Skeleton width="60%" height={48} radius={8} style={{ marginBottom: "var(--space-4)" }} />
        <Skeleton width="95%" height={22} style={{ marginBottom: "var(--space-2)" }} />
        <Skeleton width="80%" height={22} style={{ marginBottom: "var(--space-4)" }} />
        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          <Skeleton width={100} height={13} />
          <Skeleton width={72} height={13} />
        </div>
      </div>

      {/* Featured image */}
      <Skeleton
        style={{
          width: "100%",
          maxWidth: 760,
          marginInline: "auto",
          aspectRatio: "16 / 9",
          borderRadius: "var(--radius-md)",
          marginBottom: "var(--space-7)",
        }}
      />

      {/* Prose content */}
      <div style={{ maxWidth: 760, marginInline: "auto", display: "grid", gap: "var(--space-4)" }}>
        {[95, 100, 88, 100, 92, 78, 100, 95, 60].map((w, i) => (
          <Skeleton key={i} width={`${w}%`} height={16} />
        ))}
        <div style={{ height: "var(--space-4)" }} />
        {[100, 90, 100, 84, 100, 72].map((w, i) => (
          <Skeleton key={i} width={`${w}%`} height={16} />
        ))}
      </div>
    </article>
  );
}
