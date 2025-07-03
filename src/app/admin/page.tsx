"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

type Article = {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  category: { name: string };
};

export default function AdminPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    if (role !== "admin") {
      router.push("/");
      return;
    }

    const fetchArticles = async () => {
      try {
        const res = await axios.get<{ data: Article[] }>(
          "https://test-fe.mysellerpintar.com/api/articles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setArticles(res.data.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [router]);

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading admin page...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-white text-black">
      {/* Navbar Mobile */}
      <nav className="flex justify-between items-center p-4 border-b md:hidden bg-blue-600 text-white">
        <h1 className="text-xl font-bold">Dashboard Admin</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            router.push("/login");
          }}
          className="font-semibold"
        >
          Logout
        </button>
      </nav>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-60 bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-8">Dashboard Admin</h1>
          <ul className="space-y-4">
            <li
              className="hover:underline cursor-pointer"
              onClick={() => router.push("/admin")}
            >
              Articles
            </li>
            <li
              className="hover:underline cursor-pointer"
              onClick={() => router.push("/kategori")}
            >
              Category
            </li>
            <li
              className="hover:underline cursor-pointer text-red-300"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                router.push("/login");
              }}
            >
              Logout
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Articles</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => router.push("/articles/tambah")}
            >
              + Tambah Artikel
            </button>
          </div>
          <p className="mb-4 text-gray-600">Total Articles: {articles.length}</p>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Thumbnail</th>
                  <th className="border p-2 text-left">Title</th>
                  <th className="border p-2 text-left">Category</th>
                  <th className="border p-2 text-left">Created At</th>
                  <th className="border p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      {article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="bg-gray-200 w-16 h-16 flex items-center justify-center text-gray-500 rounded">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="border p-2">{article.title}</td>
                    <td className="border p-2">{article.category?.name || "-"}</td>
                    <td className="border p-2">
                      {new Date(article.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="border p-2 text-right">
                      <button
                        onClick={() => router.push(`/articles/edit/${article.id}`)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedArticles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="border p-4 text-center text-gray-500">
                      Tidak ada artikel ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {articles.length > itemsPerPage && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <p className="text-sm">
                  Page {currentPage} of {totalPages}
                </p>
                <button
                  onClick={() =>
                    setCurrentPage((p) => (p < totalPages ? p + 1 : p))
                  }
                  disabled={currentPage === totalPages}
                  className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
