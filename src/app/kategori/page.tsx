"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

type Category = { id: string; name: string; createdAt: string };
type CategoryForm = { name: string };

export default function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get<{ data: Category[] }>(
        "https://test-fe.mysellerpintar.com/api/categories",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(res.data.data);
    } catch (err) {
      console.error("Fetch categories failed:", err);
    } finally {
      setLoading(false);
    }
  };

const onSubmit = async (data: CategoryForm) => {
  try {
    if (editingCategory) {
      // Gunakan PUT sesuai API docs
      await axios.put(
        `https://test-fe.mysellerpintar.com/api/categories/${editingCategory.id}`,
        { name: data.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Kategori diperbarui!");
    } else {
      await axios.post(
        "https://test-fe.mysellerpintar.com/api/categories",
        { name: data.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Kategori ditambahkan!");
    }
    reset();
    setEditingCategory(null);
    await fetchCategories();
  } catch (err: any) {
    console.error("Submit failed:", err.response?.data || err.message);
    alert("Gagal menyimpan kategori. Periksa konsol.");
  }
};

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue("name", category.name);
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading categories...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-white text-black">
      {/* Responsive Navbar */}
      <nav className="flex justify-between items-center p-4 border-b md:hidden bg-blue-600 text-white">
        <h1 className="text-xl font-bold">Dashboard Admin - Category</h1>
        <button
          className="text-white font-semibold"
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
        <div className="flex-1 p-4 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mb-6 flex flex-wrap gap-2 items-center">
            <input
              type="text"
              {...register("name", { required: "Nama kategori wajib diisi" })}
              placeholder="Nama kategori..."
              className="border rounded p-2 flex-1 min-w-[200px]"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
            >
              {editingCategory ? "Update" : "Tambah"}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  reset();
                }}
                className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
              >
                Batal
              </button>
            )}
          </form>

          {errors.name && <p className="text-red-500 mb-4">{errors.name.message}</p>}

          <table className="min-w-full border text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left w-12">#</th>
                <th className="border p-2 text-left">Nama</th>
                <th className="border p-2 text-left">Dibuat</th>
                <th className="border p-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="border p-2">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="border p-2">{cat.name}</td>
                  <td className="border p-2">
                    {new Date(cat.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="border p-4 text-center text-gray-500">
                    Tidak ada kategori.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mb-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
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
