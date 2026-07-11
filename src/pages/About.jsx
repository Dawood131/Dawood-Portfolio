import { Helmet } from "react-helmet-async";
import AboutHero from "../sections/AboutHero";
import HorizontalTeckStack from '../sections/HorizontalTeckStack'
import DesignProcess from '../sections/DesignProcess'
import Experience from "../sections/Experience";
import Education from '../sections/Education'
import Achievements from '../sections/Achievements'
import Footer from "../components/Footer";

export default function About({ isReady }) {
  return (
    <>
      <Helmet>
        <title>About Me — Dawood Butt</title>
        <meta
          name="description"
          content="Frontend Developer based in Lahore, Pakistan. Building modern, responsive, and high-performance web experiences."
        />
      </Helmet>

      <main>
        <AboutHero isReady={isReady} />
        <HorizontalTeckStack />
        <Experience />
        <Education />
        <DesignProcess />
        <Achievements />
        <Footer />
      </main>
    </>
  );
}