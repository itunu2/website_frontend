import CardGridSkeleton from "@/components/ui/CardGridSkeleton";
export default function PortfolioLoading() {
  return <main className="section-wrap section-block"><CardGridSkeleton imageRatio="3 / 2" minCardWidth={300} showFeatured /></main>;
}
