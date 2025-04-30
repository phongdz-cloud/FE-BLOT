"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login, logout } from "@/lib/api";

export const useAuth = () => {
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    console.log("Hook: Starting handleLogin");
    try {
      console.log("Hook: Calling login API");
      const response = await login(username, password);
      console.log("Hook: Login API response", response);
      if (response.token) {
        console.log("Hook: Login successful, showing success toast");
        toast.success("Đăng nhập thành công", {
          duration: 3000,
          position: "top-center",
        });
        console.log("Hook: Redirecting to dashboard");
        router.push("/dashboard");
      }
    } catch (error) {
      console.log("Hook: Error caught in handleLogin", error);
      if (error instanceof Error) {
        console.log("Hook: Showing error toast with message:", error.message);
        toast.error(error.message, {
          duration: 3000,
          position: "top-center",
        });
      } else {
        console.log("Hook: Showing generic error toast");
        toast.error("Đăng nhập thất bại. Vui lòng thử lại sau.", {
          duration: 3000,
          position: "top-center",
        });
      }
    }
  };

  const handleLogout = async () => {
    console.log("Hook: Handling logout");
    try {
      await logout();
      toast.success("Đăng xuất thành công", {
        duration: 3000,
        position: "top-center",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại sau.", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  return {
    handleLogin,
    handleLogout,
  };
};
