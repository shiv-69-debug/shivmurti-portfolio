import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Scene from './Scene'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    number: '01',
    type: 'AI-ASSISTED DEVELOPER UTILITY',
    title: 'ProofBuild',
    description: 'A verifiable build capsule for source hashes, Git state, and test evidence, designed for Filecoin storage, recovery, and verification.',
    stack: ['TypeScript', 'Node.js', 'Filecoin'],
    link: 'https://github.com/shiv-69-debug/proofbuild',
    linkLabel: 'VIEW PROJECT',
  },
  {
    number: '02',
    type: 'LOCAL AI SYSTEM',
    title: 'Interview Practice',
    description: 'A mock-interview platform that generates role-specific questions, evaluates answers, and gives coaching across accuracy, depth, and communication.',
    stack: ['Python', 'Flask', 'Ollama', 'Docker'],
    link: 'mailto:shivmurthydoddini@gmail.com?subject=Interview%20Practice%20walkthrough',
    linkLabel: 'REQUEST WALKTHROUGH',
  },
  {
    number: '03',
    type: 'FIREBASE WEB APPLICATION',
    title: 'Milan Shaadi',
    description: 'A responsive matchmaking website with Google, phone, and email/password authentication, configured and deployed with Firebase Hosting.',
    stack: ['HTML/CSS', 'JavaScript', 'Firebase'],
    link: 'mailto:shivmurthydoddini@gmail.com?subject=Milan%20Shaadi%20walkthrough',
    linkLabel: 'REQUEST WALKTHROUGH',
  },
]

const skills = [
  ['Programming', 'Java / Python / JavaScript / SQL / C / C++'],
  ['Web development', 'HTML / CSS / React / Node.js / Flask'],
  ['AI / ML', 'NumPy / Pandas / Ollama / ML fundamentals'],
  ['Data', 'Firebase / MySQL / Git / Docker'],
  ['Exposure', 'AWS services / cloud / Unity / Android Studio'],
]

const journey = [
  ['2026', 'AI-ML Virtual Internship', 'AICTE - EduSkills / Supported by Google for Developers', 'Grade O. Machine-learning fundamentals with practical NumPy and Pandas work.'],
  ['2026', 'ProofBuild wins Builder Challenge', 'FilecoinTLDR Builder Challenge Cycle 3', 'One of five winners from 14 submissions. Received a $50 USDFC prize.'],
  ['2025 - now', 'Android Lead', 'GDG On Campus / NMCOE', 'Workshops, mentoring, Android Studio support, and technical community building.'],
  ['2024 - 25', 'Vice President', 'Association of Computer Engineering Students', 'Technical events, committee coordination, team management, and faculty communication.'],
]

function Loader({ onEnter }) {
  const [progress, setProgress] = useState(0)
  const [mouse, setMouse] = useState({ x: 50, y: 50 })
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(value + 4, 100))
    }, 22)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div
      className={`loader ${clicked ? 'loader-clicked' : ''}`}
      style={{ '--mouse-x': `${mouse.x}%`, '--mouse-y': `${mouse.y}%` }}
      onMouseMove={(event) => {
        setMouse({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 })
      }}
    >
      <div className="loader-top"><span>SHIVMURTI DODDINI</span><span>PORTFOLIO / 2026</span></div>
      <div className="loader-marquee" aria-hidden="true"><span>SOFTWARE DEVELOPER</span><span>AI / ML BUILDER</span><span>SOFTWARE DEVELOPER</span></div>
      <div className="loader-center">
        <div className="loader-orb" />
        <button className="enter-button" onClick={() => { setClicked(true); window.setTimeout(onEnter, 900) }} disabled={progress < 100}>
          <span>{progress < 100 ? `LOADING ${progress}%` : 'ENTER PORTFOLIO'}</span>
          <i aria-hidden="true">+</i>
        </button>
      </div>
      <div className="loader-bottom"><span>ULHASNAGAR, INDIA</span><span>SCROLL TO EXPLORE</span></div>
    </div>
  )
}

function Nav() {
  const items = [['WORK', 'work'], ['ABOUT', 'about'], ['PLAY', 'play'], ['CONTACT', 'contact']]
  return (
    <header className="nav">
      <a className="nav-logo" href="#top" aria-label="Back to top" data-cursor="disable">SD<span>.</span></a>
      <nav>{items.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <a className="nav-status" href="mailto:shivmurthydoddini@gmail.com" data-cursor="disable"><span /> AVAILABLE FOR WORK</a>
  </header>
  )
}

function Cursor() {
  useEffect(() => {
    const cursor = document.querySelector('.cursor-main')
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return undefined
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY
    let frame
    const move = (event) => { targetX = event.clientX; targetY = event.clientY }
    const tick = () => {
      currentX += (targetX - currentX) / 6
      currentY += (targetY - currentY) / 6
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      frame = requestAnimationFrame(tick)
    }
    const enter = (event) => event.currentTarget.dataset.cursor !== 'disable' && cursor.classList.add('cursor-hover')
    const leave = () => cursor.classList.remove('cursor-hover')
    const links = document.querySelectorAll('a, button, [data-cursor="disable"]')
    window.addEventListener('mousemove', move)
    links.forEach((link) => { link.addEventListener('mouseenter', enter); link.addEventListener('mouseleave', leave) })
    tick()
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(frame)
      links.forEach((link) => { link.removeEventListener('mouseenter', enter); link.removeEventListener('mouseleave', leave) })
    }
  }, [])
  return <div className="cursor-main" aria-hidden="true"><span /></div>
}

function App() {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('is-locked', !entered)
    return () => document.body.classList.remove('is-locked')
  }, [entered])

  useEffect(() => {
    if (!entered) return undefined
    const lenis = new Lenis({ duration: 1.45, smoothWheel: true, wheelMultiplier: 1.1 })
    const updateScroll = () => ScrollTrigger.update()
    const lenisFrame = (time) => lenis.raf(time * 1000)
    lenis.on('scroll', updateScroll)
    gsap.ticker.add(lenisFrame)
    gsap.ticker.lagSmoothing(0)
    const context = gsap.context(() => {
      gsap.fromTo('.hero-title-wrap > *', { opacity: 0, y: 60, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.15, stagger: 0.08, ease: 'power3.out', delay: 0.12 })
      gsap.fromTo('.hero-art', { opacity: 0, scale: 0.82, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: 'power3.out', delay: 0.3 })
      gsap.fromTo('.nav, .hero-meta, .scroll-cue', { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.4 })
      gsap.utils.toArray('.section-heading, .project-card, .about-lead, .about-copy, .skill-row, .journey-row, .contact-section h2, .contact-bottom').forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 84%', toggleActions: 'play none none reverse' } })
      })
      gsap.to('.hero-art', { yPercent: 28, rotate: 5, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
    })
    return () => { context.revert(); lenis.destroy(); gsap.ticker.remove(lenisFrame) }
  }, [entered])

  return (
    <>
      {!entered && <Loader onEnter={() => setEntered(true)} />}
      <div className={`site ${entered ? 'site-visible' : ''}`}>
        <Cursor />
        <Nav />
        <main id="top">
          <section className="hero section-frame">
            <div className="hero-meta"><span>01 / 04</span><span>INTRODUCTION</span></div>
            <div className="hero-title-wrap">
              <p className="eyebrow">Computer Science undergraduate / Software Developer</p>
              <h1>SHIVMURTI<br /><em>DODDINI</em></h1>
              <p className="hero-summary">I build useful software at the intersection of web development, AI/ML, and developer tools.</p>
            </div>
            <div className="hero-art"><Scene /></div>
            <a className="scroll-cue" href="#work"><span className="scroll-line" />SCROLL TO DISCOVER</a>
          </section>

          <div className="marquee" aria-hidden="true"><div><span>AI / ML</span><b>+</b><span>SOFTWARE</span><b>+</b><span>COMMUNITY</span><b>+</b><span>SHIPPING</span><b>+</b><span>AI / ML</span><b>+</b><span>SOFTWARE</span></div></div>

          <section className="section-frame work-section" id="work">
            <div className="section-heading"><div><span className="section-index">02</span><h2>SELECTED<br /><em>WORK</em></h2></div><p>Small systems, shipped with intent.<br />A few things I have been building.</p></div>
            <div className="project-list">{projects.map((project) => <article className="project-card" key={project.number}><div className="project-head"><span>{project.number} / {project.type}</span><span>2026</span></div><div className="project-body"><h3>{project.title}</h3><p>{project.description}</p></div><div className="project-foot"><div className="project-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div><a href={project.link} target={project.link.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{project.linkLabel} <b>↗</b></a></div></article>)}</div>
          </section>

          <section className="section-frame about-section" id="about">
            <div className="section-heading"><div><span className="section-index">03</span><h2>THE<br /><em>BUILDER</em></h2></div><p>Curious about systems.<br />Serious about shipping.</p></div>
            <div className="about-grid"><p className="about-lead">I am a Computer Science undergraduate focused on turning complex ideas into practical, interactive products.</p><div className="about-copy"><p>Currently pursuing a B.Tech in Computer Science and Engineering at Nanasaheb Mahadik College of Engineering, I work across Python, JavaScript, Flask, React, Firebase, and local LLM integrations.</p><p>Outside the editor, I lead student communities through GDG On Campus and ACES. I enjoy building in public, learning by shipping, and making technical ideas easier to use.</p><a className="text-link" href="https://www.linkedin.com/in/shivmurti-doddini-74387b1b0/" target="_blank" rel="noreferrer">MORE ON LINKEDIN <b>↗</b></a></div></div>
            <div className="skill-list">{skills.map(([name, values]) => <div className="skill-row" key={name}><span>{name}</span><strong>{values}</strong><i>↗</i></div>)}</div>
          </section>

          <section className="section-frame journey-section" id="play">
            <div className="section-heading"><div><span className="section-index">04</span><h2>ON THE<br /><em>WAY</em></h2></div><p>Leadership, learning,<br />and momentum.</p></div>
            <div className="journey-list">{journey.map(([year, title, org, description]) => <article className="journey-row" key={title}><time>{year}</time><div><h3>{title}</h3><span>{org}</span><p>{description}</p></div><i>↗</i></article>)}</div>
          </section>

          <section className="contact-section" id="contact"><div className="contact-inner section-frame"><span className="section-index">05 / LET'S TALK</span><h2>MAKE SOMETHING<br /><em>USEFUL.</em></h2><div className="contact-bottom"><p>Open to AI/ML internships, entry-level software roles, and thoughtful collaborations.</p><div><a href="mailto:shivmurthydoddini@gmail.com">shivmurthydoddini@gmail.com</a><a href="https://github.com/shiv-69-debug" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="https://www.linkedin.com/in/shivmurti-doddini-74387b1b0/" target="_blank" rel="noreferrer">LINKEDIN ↗</a></div></div></div></section>
        </main>
        <footer className="footer section-frame"><span>© 2026 SHIVMURTI DODDINI</span><span>BUILT WITH CURIOSITY / ULHASNAGAR, INDIA</span></footer>
      </div>
    </>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
