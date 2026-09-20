import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-4">
      <Link href="/" className="text-lg font-semibold text-gray-900">
        Movie Recommendation
      </Link>

      <div className="flex gap-6">
        <Link
          href="/movies"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Top 250
        </Link>

        <Link
          href="/search"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Search
        </Link>

        <Link
          href="/explore"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Explore
        </Link>

        <Link
          href="/library"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Library
        </Link>
      </div>
    </nav>
  );
}
