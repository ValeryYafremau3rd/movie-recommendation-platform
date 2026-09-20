import PageHeader from "@/components/PageHeader";
import RecommendationQueue from "@/components/explore/RecommendationQueue";

export default async function RecommendationPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader title="Explore" description="Movies you may like." />
      <section>
        <RecommendationQueue />
      </section>
    </main>
  );
}
