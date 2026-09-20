import PageHeader from "@/components/PageHeader";
import TopMovies from "@/components/movie/top/TopMovies";

export default function MoviesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader
        title="Top 250 Awarded Movies"
        description="Movies with the highest number of awards in the collection."
      />

      <TopMovies />
    </main>
  );
}
