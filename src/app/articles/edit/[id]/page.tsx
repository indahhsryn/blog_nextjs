"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  categoryId: z.string().min(1, "Category wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

type Article = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
};

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<FormValues | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Fetch artikel by ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get<{ data: Article }>(
          `https://test-fe.mysellerpintar.com/api/articles/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res.data.data;
        reset({
          title: data.title,
          content: data.content,
          categoryId: data.categoryId,
        });
      } catch (error) {
        console.error("Gagal ambil artikel", error);
        alert("Gagal mengambil artikel");
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router, reset]);

  const onSubmit = async (values: FormValues) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `https://test-fe.mysellerpintar.com/api/articles/${id}`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Artikel berhasil diupdate!");
      router.push("/admin");
    } catch (error: any) {
      console.error("Update gagal", error.response?.data);
      alert("Gagal update artikel");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading artikel...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-white text-black">
      {/* Sidebar */}
      <div className="flex flex-col md:flex-row flex-1">
        <aside className="hidden md:flex md:flex-col md:w-60 bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-8">Dashboard Admin</h1>
          <ul className="space-y-4">
            <li className="hover:underline cursor-pointer" onClick={() => router.push("/admin")}>
              Articles
            </li>
            <li className="hover:underline cursor-pointer" onClick={() => router.push("/kategori")}>
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

        <div className="flex-1 p-4 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Edit Article</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-6 rounded shadow">
            <div>
              <label className="block mb-1 text-sm">Judul</label>
              <input
                type="text"
                {...register("title")}
                className="w-full border p-2 rounded"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block mb-1 text-sm">Konten</label>
              <textarea
                rows={5}
                {...register("content")}
                className="w-full border p-2 rounded"
              ></textarea>
              {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
            </div>

            <div>
              <label className="block mb-1 text-sm">Category ID</label>
              <input
                type="text"
                {...register("categoryId")}
                className="w-full border p-2 rounded"
              />
              {errors.categoryId && (
                <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setPreview(watch())}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded w-full"
              >
                Preview
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>

            {preview && (
              <div className="border-t pt-4 mt-4">
                <h2 className="text-xl font-bold mb-2">Preview</h2>
                <p><strong>Judul:</strong> {preview.title}</p>
                <p><strong>Konten:</strong> {preview.content}</p>
                <p><strong>Category ID:</strong> {preview.categoryId}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
