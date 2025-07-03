"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["User", "Admin"], "Role harus User atau Admin"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "User" },
  });

  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await axios.post(
        "https://test-fe.mysellerpintar.com/api/auth/register",
        data
      );
      if (res.status === 200 || res.status === 201) {
        const token = res.data.token;
        const role = data.role;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role.toLowerCase()); // konsisten simpan lowercase

        if (role === "Admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      const resp = err.response;
      console.error("REGISTER FAILED:", resp?.status, resp?.data);
      alert(`Register gagal: ${JSON.stringify(resp?.data || err.message)}`);
    }
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/background-image.jpg')" }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="backdrop-blur-sm bg-white/10 border border-white/30 text-black p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        {/* Ikon user */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full p-4">
            <svg
              className="w-8 h-8 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        {/* Username */}
        <div className="mb-4">
          <label className="text-sm block mb-1">Username</label>
          <input
            type="text"
            {...formRegister("username")}
            className="w-full bg-transparent border border-white/50 text-black placeholder-white p-2 rounded"
            placeholder="Masukkan username"
          />
          {errors.username && (
            <p className="text-red-400 text-sm">{errors.username.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm block mb-1">Password</label>
          <input
            type="password"
            {...formRegister("password")}
            className="w-full bg-transparent border border-white/50 text-black placeholder-white p-2 rounded"
            placeholder="Masukkan password"
          />
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="text-sm block mb-1">Role</label>
          <select
            {...formRegister("role")}
            className="w-full bg-transparent border border-white/50 text-black p-2 rounded"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-400 text-sm">{errors.role.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center mb-4 text-black text-sm">
          <input type="checkbox" className="mr-2" /> Remember me
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold py-2 rounded transition"
        >
          {isSubmitting ? "Registering..." : "REGISTER"}
        </button>

        {/* Link ke login */}
        <p className="text-center text-black text-sm mt-4">
          Sudah punya akun?{" "}
          <a href="/login" className="text-black-300 hover:underline transition-all">
            Login
          </a>
        </p>
      </form>
    </main>
  );
}
