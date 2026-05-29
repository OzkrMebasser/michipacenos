
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import About from "./components/About";
import AdoptionSection from "./components/AdoptionSection";
import DonateSection from "./components/DonateSection";
import Stories from "./components/Stories";
import HowToHelp from "./components/HowToHelp";
import Footer from "./components/Footer";
import MichiMap from "./components/MichiMap";
export default function Home() {
  return (
    <div className="font-sans antialiased overflow-x-hidden">

    
      <Hero />
      <Stats />
      <About />
      <AdoptionSection />
      <DonateSection />
      <Stories />
      <HowToHelp /> 
      <MichiMap />
     
    </div>
  );
}
