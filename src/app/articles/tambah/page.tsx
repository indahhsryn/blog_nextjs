"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const articleSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  categoryId: z.string().min(1, "Category wajib dipilih"),
});

type ArticleForm = z.infer<typeof articleSchema>;

type Category = {
  id: string;
  name: string;
};

export default function TambahArticlePage() {
  const router = useRouter();
  const [preview, setPreview] = useState<ArticleForm | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get<{ data: Category[] }>(
          "https://test-fe.mysellerpintar.com/api/categories",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories(res.data.data);
      } catch (err) {
        console.error("Failed fetch categories", err);
        alert("Gagal mengambil kategori");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

const onSubmit = async (data: ArticleForm) => {
  const token = localStorage.getItem("token");
  try {
    await axios.post(
      "https://test-fe.mysellerpintar.com/api/articles",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Article berhasil dibuat!");
    router.replace("/admin"); // pakai replace biar Next reload page
  } catch (error: any) {
    console.error("Create failed", error.response?.data);
    alert("Gagal menambah artikel");
  }
};


  return (
    <main className="flex flex-col min-h-screen bg-white text-black">
      {/* Navbar Mobile */}
      <nav className="flex justify-between items-center p-4 border-b md:hidden bg-blue-600 text-white">
        <h1 className="text-xl font-bold">Tambah Artikel</h1>
        <button
          className="font-semibold"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            router.push("/login");
          }}
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
        <div className="flex-1 p-4 flex justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-lg border p-6 rounded shadow space-y-4"
          >
            <h2 className="text-2xl font-bold mb-4">Tambah Artikel</h2>

            <div>
              <label className="block mb-1 text-sm">Judul</label>
              <input
                type="text"
                {...register("title")}
                className="w-full border p-2 rounded"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm">Konten</label>
              <textarea
                rows={5}
                {...register("content")}
                className="w-full border p-2 rounded"
              ></textarea>
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm">Kategori</label>
              <select
                {...register("categoryId")}
                className="w-full border p-2 rounded"
                disabled={loadingCategories}
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
                <h3 className="text-xl font-bold mb-2">Preview</h3>
                <p><strong>Judul:</strong> {preview.title}</p>
                <p><strong>Konten:</strong> {preview.content}</p>
                <p><strong>Category ID:</strong> {preview.categoryId}</p>
                <p><strong>Category Name:</strong> {categories.find(c => c.id === preview.categoryId)?.name || "-"}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
