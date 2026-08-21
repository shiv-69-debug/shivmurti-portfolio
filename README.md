# Shivmurti Doddini - Portfolio

Public portfolio website for Shivmurti Doddini, a Computer Science undergraduate and aspiring Software Developer focused on AI/ML, web development, and developer tools.

## Live Website

https://shiv-69-debug.github.io/shivmurti-portfolio/

## Highlights

- Full-screen loading and portfolio reveal animation
- Three.js WebGL character scene with mouse and scroll interaction
- Floating particles, lighting, laptop screen glow, and 3D motion
- GSAP scroll-triggered section reveals and hero parallax
- Lenis smooth scrolling
- Custom animated cursor on desktop
- Responsive layout for mobile and desktop
- Project showcase for ProofBuild, Interview Practice, and Milan Shaadi
- Skills, leadership, internship, award, and contact sections

## Built With

- React
- Vite
- Three.js
- React Three Fiber
- React Three Drei
- GSAP
- Lenis
- CSS

## Run Locally

Requirements:

- Node.js 20 or newer
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The local development site will be available at the URL shown by Vite, usually `http://localhost:5173`.

## Production Build

```bash
npm run build
npm run preview
```

## Deployment

The project is deployed with GitHub Pages through the workflow in `.github/workflows/deploy.yml`.

Every push to the `main` branch triggers:

1. Dependency installation
2. Vite production build
3. GitHub Pages deployment

## Project Structure

```text
src/
  main.jsx       Application layout, sections, loader, cursor, and animations
  Scene.jsx      Three.js / React Three Fiber WebGL scene
  styles.css     Visual system, responsive styles, and motion states
index.html       Application entry document
vite.config.js   Vite configuration and GitHub Pages base path
```

## Featured Projects

### ProofBuild

An AI-assisted developer utility that packages source hashes, Git state, and test evidence into verifiable build capsules for Filecoin storage, verification, and recovery.

Repository: https://github.com/shiv-69-debug/proofbuild

### AI-Powered Interview Practice

A Python/Flask mock-interview platform using a local LLM to generate role-specific questions, evaluate responses, and provide coaching feedback.

### Milan Shaadi

A responsive matchmaking web application with Firebase Authentication for Google, phone, and email/password sign-in.

## Contact

- Email: shivmurthydoddini@gmail.com
- LinkedIn: https://www.linkedin.com/in/shivmurti-doddini-74387b1b0/
- GitHub: https://github.com/shiv-69-debug
- Location: Ulhasnagar, Thane, Maharashtra, India

## License

This repository is a personal portfolio project. Please contact Shivmurti before reusing the content, design, or personal information.
