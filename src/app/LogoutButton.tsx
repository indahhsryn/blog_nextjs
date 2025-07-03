"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="hover:underline cursor-pointer text-left w-full text-white"
    >
      Logout
    </button>
  );
}
