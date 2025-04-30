"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/posts"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/posts" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Posts
      </Link>
      <Link
        href="/categories"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/categories" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Categories
      </Link>
    </div>
  );
}
