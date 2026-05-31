import Hero from "./components/Hero";
import Stats from "./components/Stats";
import About from "./components/About";
import CampaignBanner from "./components/CampaignBanner";
import AdoptionSection from "./components/AdoptionSection";
import DonateSection from "./components/DonateSection";
import Stories from "./components/Stories";
import HowToHelp from "./components/HowToHelp";

import MichiMap from "./components/MichiMap";
import ScrollToHash from "./components/ScrollToHash";
export default function Home() {
  return (
    <div className="font-sans antialiased overflow-x-hidden">
      <ScrollToHash />
      <Hero />
      <Stats />
      <About />
      <CampaignBanner />
      <AdoptionSection />
      <DonateSection />
      <Stories />
      <HowToHelp />
      <MichiMap />
    </div>
  );
}
