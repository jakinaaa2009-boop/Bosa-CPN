import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { HowToParticipate } from "@/components/HowToParticipate";
import { PrizeSection } from "@/components/PrizeSection";
import { ProductGrid } from "@/components/ProductGrid";
import { WinnersSection } from "@/components/WinnersSection";
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <HowToParticipate />
        <PrizeSection />
        <ProductGrid />
        <WinnersSection />
      </main>
    </>
  );
}
