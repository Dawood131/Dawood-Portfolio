<p align="center">
  <img src="./public/files/Logo.webp" alt="Dawood Portfolio Logo" width="120" />
</p>

# Dawood Portfolio

A modern, animation-heavy personal portfolio built with React and Vite. Features scroll-driven project cards, smooth scrolling, 3D elements, and interactive UI components.

## Tech Stack

**Core**
- [React 19](https://react.dev/) — UI library
- [Vite 8](https://vitejs.dev/) — build tool & dev server
- [React Router 7](https://reactrouter.com/) — client-side routing
- [Redux Toolkit](https://redux-toolkit.js.org/) + [React Redux](https://react-redux.js.org/) — state management

**Animation & Motion**
- [GSAP](https://gsap.com/) + [@gsap/react](https://gsap.com/resources/React/) — scroll-triggered timelines and transitions
- [Framer Motion](https://www.framer.com/motion/) — component-level animation
- [Lenis](https://lenis.darkroom.engineering/) — smooth scrolling
- [@use-gesture/react](https://use-gesture.netlify.app/) — gesture handling

**3D / Graphics**
- [Three.js](https://threejs.org/)
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei) — React renderer & helpers for Three.js
- [OGL](https://github.com/oframe/ogl) — lightweight WebGL library

**UI / Styling**
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) — icon set

**Utilities**
- [EmailJS](https://www.emailjs.com/) — contact form email sending
- [React Helmet Async](https://github.com/staylor/react-helmet-async) — document head / SEO management

**Tooling**
- ESLint 9 with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`

## Project Structure

```
src/
├── components/
│   ├── CustomCursor.jsx
│   ├── CustomScrollbar.jsx
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── Particles.jsx
│   ├── ParticlesBg.jsx
│   ├── Preloader.jsx
│   ├── ProjectPage.jsx
│   ├── RevealText.jsx
│   ├── SkillsDome.jsx
│   ├── SpotlightCard.jsx
│   └── StaggeredMenu.jsx
├── data/
│   ├── achievements.js
│   ├── experience.js
│   ├── projects.js
│   └── skills.js
├── hooks/
├── lib/
│   └── lenis.js
├── pages/
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Home.jsx
│   ├── ProjectDetail.jsx
│   └── Projects.jsx
├── sections/
│   ├── AboutHero.jsx
│   ├── Achievements.jsx
│   ├── DesignProcess.jsx
|   ├── Education.jsx
│   ├── Experience.jsx
│   ├── Hero.jsx
│   ├── HorizontalScroll.jsx
│   ├── HorizontalTeckStack.jsx
│   ├── ProjectSection.jsx
│   ├── Skills.jsx
│   └── WhyWorkWithMe.jsx
├── store/
│   ├── projectSlice.js
│   └── store.js
├── App.jsx
├── index.css
└── main.jsx
```

### Folder Overview

| Folder | Purpose |
|---|---|
| `components/` | Reusable, standalone UI pieces (cursor, scrollbar, nav, menus, cards) used across pages |
| `data/` | Static content (project list, skills, experience, achievements) that drives the UI |
| `hooks/` | Custom React hooks |
| `lib/` | Small utility/config modules (e.g. Lenis smooth-scroll setup) |
| `pages/` | Top-level route components rendered by React Router |
| `sections/` | Larger page sections composed together inside pages (hero, skills, experience, etc.) |
| `store/` | Redux Toolkit slices and store configuration |
