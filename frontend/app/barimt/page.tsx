import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SubmitReceiptSection } from "@/components/SubmitReceiptSection";

export const metadata: Metadata = {
  title: "Баримт оруулах",
  description: "Нэвтрээд НӨАТ-ын баримтаа илгээнэ үү",
};

export default function BarimtPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-gradient-to-b from-cream via-pink-50/50 to-cyan-50/40">
        <SubmitReceiptSection />
      </main>
    </>
  );
}
