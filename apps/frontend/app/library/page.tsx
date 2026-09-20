import Toggle, { Tab } from "@/components/Toggle";

import LikedMovies from "@/components/library/LikedMovies";
import DislikedMovies from "@/components/library/DislikedMovies";
import SavedMovies from "@/components/library/SavedMovies";
import PageHeader from "@/components/PageHeader";
import { Suspense } from "react";

export default function LibraryPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader
        title="My Library"
        description="Your liked, disliked, and saved movies."
      />
      <Suspense>
        <Toggle>
          <Tab title="Liked" path="/library?tab=liked">
            <LikedMovies />
          </Tab>

          <Tab title="Disliked" path="/library?tab=disliked">
            <DislikedMovies />
          </Tab>

          <Tab title="Saved" path="/library?tab=saved">
            <SavedMovies />
          </Tab>
        </Toggle>
      </Suspense>
    </main>
  );
}
