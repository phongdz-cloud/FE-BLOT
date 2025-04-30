import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface SignupRequest {
  username: string;
  email: string;
  password: string;
  roles?: string[];
}

interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface MessageResponse {
  message: string;
}

interface SignupResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

// Hàm helper để xử lý lỗi từ BE
const handleApiError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    // Ưu tiên lấy message từ response của BE
    if (error.response?.data) {
      const apiError = error.response.data as ApiResponse<any>;
      if (apiError.message) {
        return new Error(apiError.message);
      }
    }

    // Nếu không có message từ BE, sử dụng status code để xác định message
    switch (error.response?.status) {
      case 401:
        return new Error("Tên đăng nhập hoặc mật khẩu không đúng");
      case 403:
        return new Error("Bạn không có quyền thực hiện thao tác này");
      case 404:
        return new Error("Không tìm thấy tài nguyên");
      case 500:
        return new Error("Lỗi hệ thống. Vui lòng thử lại sau");
      default:
        return new Error("Đã xảy ra lỗi. Vui lòng thử lại sau");
    }
  }

  // Nếu không phải lỗi từ axios
  if (error instanceof Error) {
    return error;
  }

  return new Error("Đã xảy ra lỗi không xác định");
};

export const login = async (
  username: string,
  password: string
): Promise<JwtResponse> => {
  console.log("API: Starting login process");
  try {
    console.log("API: Making login request");
    const response = await api.post<ApiResponse<JwtResponse>>("/auth/signin", {
      username,
      password,
    });
    console.log("API: Login response received", response.data);

    if (!response.data.success) {
      console.log("API: Login failed with message", response.data.message);
      throw new Error(response.data.message);
    }

    if (response.data.data.token) {
      console.log("API: Setting token cookie");
      document.cookie = `token=${response.data.data.token}; path=/; max-age=86400`; // 1 day
    }
    return response.data.data;
  } catch (error) {
    console.log("API: Login error caught", error);
    throw handleApiError(error);
  }
};

export const register = async (
  data: SignupRequest
): Promise<SignupResponse> => {
  try {
    const response = await api.post<ApiResponse<SignupResponse>>(
      "/auth/signup",
      {
        ...data,
        roles: data.roles || ["user"],
      }
    );

    if (!response.data.success) {
      // Nếu có message từ BE, sử dụng message đó
      if (response.data.message) {
        throw new Error(response.data.message);
      }
      throw new Error("Đăng ký thất bại");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const apiError = error.response.data as ApiResponse<any>;
      // Ưu tiên sử dụng message từ BE
      if (apiError.message) {
        throw new Error(apiError.message);
      }
    }
    throw handleApiError(error);
  }
};

// Thêm hàm logout
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Xóa token dù API call có thành công hay không
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

// Thêm token vào header cho các request yêu cầu xác thực
api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor response để xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginEndpoint = error.config.url?.includes("/auth/signin");

      if (!isLoginEndpoint) {
        // Xóa token
        logout();
        // Kiểm tra nếu đang ở client-side
        if (typeof window !== "undefined") {
          // Hiển thị toast và chuyển hướng
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
            duration: 3000,
            position: "top-center",
          });
        }
      }
    }
    return Promise.reject(error);
  }
);

export const getUserDetails = async () => {
  try {
    console.log("API: Getting user details");
    const response = await api.get("/users/me");
    console.log("API: User details response", response.data);
    return response.data;
  } catch (error) {
    console.error("API: Error getting user details:", error);
    throw error;
  }
};

export default api;
