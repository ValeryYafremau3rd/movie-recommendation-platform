import PageHeader from "@/components/PageHeader";
import Toggle, { Tab } from "@/components/Toggle";

import StrictSearch from "@/components/search/strict/StrictSearch";
import AiSearch from "@/components/search/AiSearch";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader
        title="Search"
        description="Search movies or get personalized recommendations."
      />
      <Suspense>
        <Toggle>
          <Tab title="Strict" path="/search?tab=strict">
            <StrictSearch />
          </Tab>

          <Tab title="Smart" path="/search?tab=smart">
            <AiSearch />
          </Tab>
        </Toggle>
      </Suspense>
    </main>
  );
}
