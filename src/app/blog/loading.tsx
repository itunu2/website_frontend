export default function BlogLoading() {
  return (
    <main className="section-wrap section-block">
      {/* Header skeleton */}
      <div style={{ marginBottom: "var(--space-8)", textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 14,
            background: "var(--surface-soft)",
            borderRadius: 4,
            margin: "0 auto var(--space-3)",
          }}
          className="skeleton"
        />
        <div
          style={{
            width: 340,
            maxWidth: "80%",
            height: 40,
            background: "var(--surface-soft)",
            borderRadius: 6,
            margin: "0 auto var(--space-4)",
          }}
          className="skeleton"
        />
        <div
          style={{
            width: 420,
            maxWidth: "90%",
            height: 18,
            background: "var(--surface-soft)",
            borderRadius: 4,
            margin: "0 auto",
          }}
          className="skeleton"
        />
      </div>

      {/* Tag + search row skeleton */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-3)",
          marginBottom: "var(--space-5)",
          flexWrap: "wrap",
        }}
      >
        {[80, 60, 90, 70].map((w, i) => (
          <div
            key={i}
            style={{
              width: w,
              height: 32,
              background: "var(--surface-soft)",
              borderRadius: "var(--radius-pill)",
            }}
            className="skeleton"
          />
        ))}
      </div>

      {/* Card grid skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "var(--space-5)",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              background: "var(--surface-card)",
              border: "1px solid var(--border-soft)",
            }}
          >
            <div
              style={{ width: "100%", aspectRatio: "16 / 9", background: "var(--surface-soft)" }}
              className="skeleton"
            />
            <div style={{ padding: "var(--space-5)" }}>
              <div
                style={{ width: "40%", height: 12, background: "var(--surface-soft)", borderRadius: 4, marginBottom: "var(--space-3)" }}
                className="skeleton"
              />
              <div
                style={{ width: "90%", height: 20, background: "var(--surface-soft)", borderRadius: 4, marginBottom: "var(--space-2)" }}
                className="skeleton"
              />
              <div
                style={{ width: "70%", height: 20, background: "var(--surface-soft)", borderRadius: 4, marginBottom: "var(--space-4)" }}
                className="skeleton"
              />
              <div
                style={{ width: "100%", height: 14, background: "var(--surface-soft)", borderRadius: 4, marginBottom: "var(--space-2)" }}
                className="skeleton"
              />
              <div
                style={{ width: "80%", height: 14, background: "var(--surface-soft)", borderRadius: 4 }}
                className="skeleton"
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
