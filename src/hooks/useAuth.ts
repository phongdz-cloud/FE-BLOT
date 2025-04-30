"use client";

import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { login, logout, getUserDetails } from "@/lib/api";
import { useState, useEffect, useRef } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isFetchingRef = useRef(false);

  const fetchUserDetails = async () => {
    if (isFetchingRef.current) {
      console.log("Already fetching user details, skipping...");
      return;
    }

    try {
      isFetchingRef.current = true;
      console.log("Fetching user details...");
      const userDetails = await getUserDetails();
      setUser(userDetails);
      setIsAuthenticated(true);
      return userDetails;
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Không kiểm tra auth nếu đang ở trang login
      if (pathname === "/login") {
        setLoading(false);
        return;
      }

      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("No token found");
        }

        await fetchUserDetails();
      } catch (error) {
        console.error("Auth check failed:", error);
        // Nếu không phải trang login và không có token, chuyển hướng về login
        if (pathname !== "/login") {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

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

        // Đợi một chút để đảm bảo token đã được lưu vào cookie
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Lấy thông tin người dùng sau khi đăng nhập thành công
        console.log("Hook: Fetching user details");
        await fetchUserDetails();

        // Chuyển hướng đến dashboard
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
      setUser(null);
      setIsAuthenticated(false);
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
    user,
    loading,
    isAuthenticated,
    handleLogin,
    handleLogout,
  };
};
