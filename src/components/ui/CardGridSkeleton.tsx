import Skeleton from "./Skeleton";

interface CardGridSkeletonProps {
  /** CSS aspect-ratio of card image. Default "16 / 9" */
  imageRatio?: string;
  /** minmax min value for grid columns. Default 280px */
  minCardWidth?: number;
  /** Number of ghost cards to show. Default 6 */
  count?: number;
  /** Show a tall featured-card placeholder above the grid */
  showFeatured?: boolean;
}

function CardSkeleton({ imageRatio = "16 / 9" }: { imageRatio?: string }) {
  return (
    <div
      style={{
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "var(--surface-card)",
        border: "1px solid var(--border-soft)",
      }}
    >
      <Skeleton style={{ width: "100%", aspectRatio: imageRatio, borderRadius: 0 }} />
      <div style={{ padding: "var(--space-5)", display: "grid", gap: "var(--space-3)" }}>
        <Skeleton width="45%" height={13} />
        <Skeleton width="90%" height={20} />
        <Skeleton width="68%" height={20} />
        <div style={{ display: "grid", gap: "var(--space-2)", marginTop: "var(--space-1)" }}>
          <Skeleton width="100%" height={13} />
          <Skeleton width="80%" height={13} />
        </div>
      </div>
    </div>
  );
}

export default function CardGridSkeleton({
  imageRatio = "16 / 9",
  minCardWidth = 280,
  count = 6,
  showFeatured = false,
}: CardGridSkeletonProps) {
  return (
    <>
      {/* Page header */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
        <Skeleton width={60} height={13} style={{ margin: "0 auto var(--space-3)" }} />
        <Skeleton width={340} height={40} radius={8} style={{ maxWidth: "80%", margin: "0 auto var(--space-4)" }} />
        <Skeleton width={440} height={18} style={{ maxWidth: "90%", margin: "0 auto" }} />
      </div>

      {/* Featured card placeholder (portfolio only) */}
      {showFeatured && (
        <Skeleton
          style={{ width: "100%", minHeight: 340, borderRadius: "var(--radius-lg)", marginBottom: "var(--space-8)" }}
        />
      )}

      {/* Tag filter + search row */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-5)", flexWrap: "wrap" }}>
        {[80, 64, 96, 72].map((w, i) => (
          <Skeleton key={i} width={w} height={32} radius={999} />
        ))}
      </div>

      {/* Card grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
          gap: "var(--space-5)",
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} imageRatio={imageRatio} />
        ))}
      </div>
    </>
  );
}
