import type { Metadata } from "next";
import { Rubik, Nunito } from "next/font/google";
import "./globals.css";

const display = Rubik({
  subsets: ["latin", "cyrillic", "latin-ext"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const body = Nunito({
  subsets: ["latin", "cyrillic", "latin-ext"],
  variable: "--font-body",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Азын сугалаа — Урамшууллын кампанит ажил",
  description:
    "Бүтээгдэхүүн худалдан авч, баримтаа оруулж, супер шагналуудын эзэн болоорой!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
