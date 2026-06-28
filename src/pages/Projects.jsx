import { Helmet } from "react-helmet-async";
import ProjectsPage from "../components/ProjectPage";

export default function Projects() {
  return (
    <>
      <Helmet>
        <title>My Projects — Dawood Butt</title>
        <meta
          name="description"
          content="Explore the frontend projects of Dawood Butt, showcasing modern UI, responsive web development, React applications, and creative web experiences."
        />
      </Helmet>

      <main><ProjectsPage /></main>
    </>
  );
}