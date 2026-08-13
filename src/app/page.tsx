import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Menu from "@/components/Menu";
import Locations from "@/components/Locations";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <Menu />
        <Locations />
        <About />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
