"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/admin"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/admin/posts"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin/posts" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Posts
      </Link>
      <Link
        href="/admin/categories"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin/categories"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Categories
      </Link>
      <Link
        href="/admin/users"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin/users" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Users
      </Link>
    </div>
  );
}
