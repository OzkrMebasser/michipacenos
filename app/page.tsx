import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import About from "./components/About";
import AdoptionSection from "./components/AdoptionSection";
import DonateSection from "./components/DonateSection";
import Stories from "./components/Stories";
import HowToHelp from "./components/HowToHelp";
import Contact from "./components/Contact";
import MichiMap from "./components/MichiMap";
export default function Home() {
  return (
    <div className="font-sans antialiased">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <AdoptionSection />
      <DonateSection />
      <Stories />
      <HowToHelp /> 
      <MichiMap />
      <Contact />
    </div>
  );
}
