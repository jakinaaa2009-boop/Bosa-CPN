"use client";

import Link from "next/link";
import Image from "next/image";

type AdminBrandLogoProps = {
  /** Winners page header — logo on dark background */
  variant?: "default" | "dark";
};

export function AdminBrandLogo({ variant = "default" }: AdminBrandLogoProps) {
  const wrap =
    variant === "dark"
      ? "rounded-xl bg-white/10 p-1.5 ring-1 ring-amber-400/35 hover:bg-white/15"
      : "rounded-xl bg-white/85 p-1.5 shadow-sm ring-2 ring-white/90 hover:bg-white";

  return (
    <Link
      href="/"
      className={`flex shrink-0 items-center transition ${wrap}`}
      aria-label="Нүүр хуудас руу"
    >
      <span className="relative block h-8 w-[min(30vw,128px)] sm:h-9 sm:w-[144px]">
        <Image
          src="/logo1.png"
          alt="Лого"
          fill
          className="object-contain object-left"
          sizes="144px"
          priority
        />
      </span>
    </Link>
  );
}
