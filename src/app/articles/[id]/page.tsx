"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

type ArticleDetail = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
  user: {
    username: string;
  };
};

type Article = {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
};

export default function ArticleDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchDetail = async () => {
      try {
        console.log("ID yang dikirim:", id);
        console.log("Token dari localStorage:", token);

        const res = await axios.get<{ data: ArticleDetail }>(
          `https://test-fe.mysellerpintar.com/api/articles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API detail response:", res.data);

        if (!res.data || !res.data.data) {
          setError("Artikel tidak ditemukan di server.");
          return;
        }

        setArticle(res.data.data);

        // Ambil artikel lain dari kategori sama
        if (res.data.data.category?.id) {
          const relatedRes = await axios.get<{ data: Article[] }>(
            `https://test-fe.mysellerpintar.com/api/articles?categoryId=${res.data.data.category.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const related = relatedRes.data.data
            .filter((a) => a.id !== id)
            .slice(0, 3);
          setOtherArticles(related);
        }
      } catch (err: any) {
        console.error("Detail fetch error:", err);
        if (err.response) {
          console.error("API responded with status:", err.response.status);
          console.error("API response data:", err.response.data);
        }
        setError("Gagal mengambil artikel. Periksa koneksi atau ID.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading detail artikel...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded shadow">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Artikel tidak ditemukan.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        {/* Judul */}
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{article.title}</h1>

        {/* Meta info */}
        <div className="text-sm text-gray-600 mb-4">
          <span>Ditulis oleh: {article.user?.username || "Unknown"}</span>
          {" • "}
          <span>
            {new Date(article.createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {" • "}
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {article.category?.name || "No Category"}
          </span>
        </div>

        {/* Konten */}
        <article
          className="prose max-w-none text-gray-800 mb-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Artikel lain */}
        {otherArticles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">
              Artikel lain di kategori {article.category.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherArticles.map((other) => (
                <div
                  key={other.id}
                  onClick={() => router.push(`/articles/${other.id}`)}
                  className="bg-white cursor-pointer hover:shadow-lg transition rounded p-4 border"
                >
                  {other.imageUrl ? (
                    <Image
                      src={other.imageUrl}
                      alt={other.title}
                      width={400}
                      height={200}
                      className="rounded mb-2 object-cover w-full h-40"
                    />
                  ) : (
                    <div className="bg-gray-200 rounded mb-2 w-full h-40 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <h3 className="font-bold text-black mb-1 text-sm">{other.title}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(other.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
