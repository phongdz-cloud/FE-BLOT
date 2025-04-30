"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { handleLogout } = useAuth();

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Chào mừng bạn đến với trang quản lý</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Đây là trang dashboard sau khi đăng nhập thành công.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/">Quay về trang chủ</Link>
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
