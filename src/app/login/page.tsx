"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

const onSubmit = async (data: LoginForm) => {
  try {
    const res = await axios.post(
      "https://test-fe.mysellerpintar.com/api/auth/login",
      {
        username: data.username,
        password: data.password,
      }
    );

    if (res.status === 200) {
      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data.token;
      const role = res.data.role || "User"; // pakai role dari response

      localStorage.setItem("token", token);
      localStorage.setItem("role", role.toLowerCase()); // simpan role lowercase, konsisten dengan register

      if (role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  } catch (err: any) {
    console.error("LOGIN FAILED", err.response?.status, err.response?.data || err.message);
    alert("Login gagal: " + (err.response?.data?.message || "Cek username/password."));
  }
};


  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/background-image.jpg')", // Ganti dengan gambar background kamu
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="backdrop-blur-sm bg-white/10 border border-white/30 text-black-300 p-8 rounded-lg shadow-lg w-full max-w-md"
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

        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {/* Username */}
        <div className="mb-4">
          <label className="text-sm block mb-1 text-black">Username</label>
          <input
            type="text"
            placeholder="Masukkan username"
            {...formRegister("username")}
            className="w-full bg-transparent border border-white/50 text-black placeholder-white p-2 rounded"
          />
          {errors.username && (
            <p className="text-red-400 text-sm">{errors.username.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm block mb-1 text-black">Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            {...formRegister("password")}
            className="w-full bg-transparent border border-white/50 text-black placeholder-white p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center mb-4 text-black text-sm">
          <input type="checkbox" className="mr-2" /> Remember me
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold py-2 rounded transition"
        >
          {isSubmitting ? "Logging in..." : "LOGIN"}
        </button>

        {/* Register */}
        <p className="text-center text-black text-sm mt-4">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-black-300 hover:underline transition-all"
          >
            Register
          </a>
        </p>

    
      </form>
    </main>
  );
}
