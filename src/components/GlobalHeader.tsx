"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "@/components/Text";
import { cn } from "@/shared/utils/cn";

const NAV_ITEMS = [
  { href: "/search", label: "도서 검색" },
  { href: "/liked", label: "내가 찜한 책" },
];

export function GlobalHeader() {
  const pathname = usePathname();

  return (
    <header className="border-gray border-b bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
        <Link href="/search">
          <Text as="span" variant="title-1">
            CERTICOS BOOKS
          </Text>
        </Link>
        <nav className="mx-auto flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("border-b-2 pb-1", isActive ? "border-accent" : "border-transparent")}
              >
                <Text
                  as="span"
                  variant="body-1"
                  color={isActive ? "primary" : "secondary"}
                  bold={isActive}
                  className="font-medium"
                >
                  {item.label}
                </Text>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
