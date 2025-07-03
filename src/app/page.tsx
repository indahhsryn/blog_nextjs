"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import axios from "axios";
import LogoutButton from "./LogoutButton";

type Article = {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  category: {
    id: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  excerpt?: string;
};

export default function HomePage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  useEffect(() => {
  const fetchArticles = async () => {
    try {
      const res = await axios.get<{ data: Article[] }>(
        "https://test-fe.mysellerpintar.com/api/articles"
      );
      setArticles(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchArticles();
}, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchCategory =
        !selectedCategory || article.category?.name === selectedCategory;
      const matchSearch =
        !debouncedQuery ||
        article.title.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [articles, selectedCategory, debouncedQuery]);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIdx = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(
    startIdx,
    startIdx + articlesPerPage
  );

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-blue-600 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">
            The Journal: Design Resources, Interviews, and Industry News
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-6">
            Your daily dose of design insights!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <select
              className="px-4 py-2 text-white bg-blue-700 rounded w-full sm:w-auto"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Semua kategori</option>
              {[...new Set(articles.map((a) => a.category?.name))]
                .filter((c) => c)
                .map((categoryName) => (
                  <option key={categoryName} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
            </select>
            <div className="flex w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 text-white rounded-l w-full"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r font-semibold hover:bg-blue-700 transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sidebar + content */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row py-8 px-4">
        {/* Sidebar */}
        <aside className="md:w-60 flex-shrink-0 mb-8 md:mb-0 md:mr-8">
          <div className="bg-blue-600 text-white rounded-lg p-4 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Logipsum</h2>
            <ul className="space-y-3">
              <li className="hover:underline cursor-pointer">Articles</li>
              <li className="hover:underline cursor-pointer">Category</li>
              <li>
                <LogoutButton />
              </li>
            </ul>
          </div>
        </aside>

        {/* Articles */}
        <div className="flex-1">
          <p className="mb-4 text-gray-700 text-sm">
            Showing: {filteredArticles.length} article(s)
          </p>

          {paginatedArticles.length === 0 ? (
            <p className="text-gray-500">No articles found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {paginatedArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => router.push(`/articles/${article.id}`)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer"
                >
                  {/* Image */}
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      width={400}
                      height={200}
                      className="rounded mb-4 object-cover w-full h-48"
                    />
                  ) : (
                    <div className="bg-gray-200 rounded mb-4 w-full h-48 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  {/* Date */}
                  <p className="text-sm text-gray-500 mb-1">
                    {article.createdAt
                      ? new Date(article.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })
                      : "No Date"}
                  </p>

                  {/* Title */}
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: "Times New Roman, serif",
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-gray-600 text-sm mb-4">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Category */}
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {article.category?.name || "No Category"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                 className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-gray-700 self-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                 className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
