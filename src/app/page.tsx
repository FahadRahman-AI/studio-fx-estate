import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Services } from "@/components/sections/Services";
import { VideoArchiveGrid } from "@/components/sections/VideoArchiveGrid";
import { Process } from "@/components/sections/Process";
import { Book } from "@/components/sections/Book";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Services />
        <VideoArchiveGrid />
        <Process />
        <Book />
      </main>
      <Footer />
    </>
  );
}
