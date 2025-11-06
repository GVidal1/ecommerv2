import { AboutHero } from "./components/AboutHero";
import { AboutContent } from "./components/AboutContent";
import { MVVSection } from "./components/MVVSection";
import { StatsSection } from "./components/StatsSection";
import { TeamSection } from "./components/TeamSection";
import { CTASection } from "./components/CTASection";
import "./styles/AboutPage.css";

export function AboutPage() {
  return (
    <div className="nosotros-container">
      <AboutHero />

      <div className="container">
        <div className="nosotros-main">
          <AboutContent />
          <MVVSection />
          <StatsSection />
          <TeamSection />
          <CTASection />
        </div>
      </div>
    </div>
  );
}
