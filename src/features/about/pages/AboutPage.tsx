import { AboutHero } from "./AboutHero";
import { AboutContent } from "./AboutContent";
import { MVVSection } from "./MVVSection";
import { StatsSection } from "./StatsSection";
import { TeamSection } from "./TeamSection";
import { CTASection } from "./CTASection";
import "../styles/About.css";

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
