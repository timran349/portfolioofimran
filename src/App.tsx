import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useReducedMotion } from 'framer-motion'

const links = [
  { label: 'Dribbble', href: 'https://dribbble.com/timran' },
  { label: 'X', href: 'https://x.com/Imranio' },
]

const projects = [
  { title: 'Founders Mine App', image: '/assets/founders-mine.jpg' },
  { title: 'Onboarding – Mood app', image: '/assets/mood-onboarding.jpg' },
  { title: 'Skill-Up Learning App', image: '/assets/skill-up.jpg' },
]

function SocialLinks({ location }: { location: 'header' | 'footer' }) {
  const footer = location === 'footer'
  const visibleLinks = footer
    ? [...links, { label: 'Email', href: 'mailto:tusharimran092@gmail.com' }]
    : [{ label: 'Projects', href: '#works' }, { label: 'Pricing', href: '#pricing' }]

  return (
    <nav className={footer ? 'social-links social-links--footer' : 'social-links'} aria-label={`${location} social links`}>
      {visibleLinks.map(({ label, href }) => (
        <a key={label} href={href}>{label}</a>
      ))}
    </nav>
  )
}

function GoogleMeetIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 19 16" fill="none">
      <path d="m10.748 7.987 1.852 2.164 2.491 1.626.433-3.776-.433-3.69-2.539 1.428-1.804 2.248Z" fill="#00832D" />
      <path d="M0 11.424v3.217c0 .735.584 1.332 1.303 1.332h3.149l.652-2.432-.652-2.117-2.161-.666L0 11.424Z" fill="#0066DA" />
      <path d="M4.452 0 0 4.549l2.292.664 2.16-.664 2.64-2.09L4.452 0Z" fill="#E94235" />
      <path d="M0 11.426h4.452V4.55H0v6.877Z" fill="#2684FC" />
      <path d="m17.936 1.926-2.844 2.384v7.466l2.856 2.393c.427.342 1.052.03 1.052-.525V2.44c0-.561-.64-.872-1.064-.514Z" fill="#00AC47" />
      <path d="M10.748 7.986v3.438H4.452v4.549h9.337c.72 0 1.303-.597 1.303-1.331v-2.867l-4.344-3.79Z" fill="#00AC47" />
      <path d="M13.788 0H4.452v4.549h6.296v3.438l4.343-3.677V1.331C15.091.596 14.507 0 13.788 0Z" fill="#FFBA00" />
    </svg>
  )
}

function ActionButton({ kind, children }: { kind: 'call' | 'message'; children: string }) {
  const href = kind === 'call' ? '#contact' : 'https://wa.me/'

  return (
    <a className="action-button" href={href}>
      {kind === 'call' ? <GoogleMeetIcon /> : <img src="/assets/social-icon.svg" alt="" aria-hidden="true" />}
      <span>{children}</span>
    </a>
  )
}

function Profile() {
  return (
    <aside className="profile" aria-label="About Tushar Imran">
      <header className="profile-header">
        <a className="wordmark" href="#top" aria-label="Tushar Imran home">imran</a>
        <SocialLinks location="header" />
      </header>

      <main className="profile-content">
        <section className="intro" aria-labelledby="name">
          <div className="identity">
            <img className="avatar" src="/assets/headshot.png" alt="Tushar Imran" />
            <div>
              <h1 id="name">Tushar Imran</h1>
              <p>Software Designer</p>
            </div>
          </div>

          <div className="summary">
            <p>Hey I’m Tushar, a software designer and maker based in Bangladesh. For over 5+ years, I’ve helped companies ship beautiful products that work well for their customers.</p>
            <div className="actions" id="contact">
              <ActionButton kind="call">Book a Call</ActionButton>
              <ActionButton kind="message">Message Me</ActionButton>
            </div>
          </div>

          <div className="timeline">
            <section>
              <h2>Previously</h2>
              <p>Product designer at <strong>Zyft</strong></p>
            </section>
            <section>
              <h2>Now</h2>
              <p>Freelancing, experimenting with Claude Code, building <strong>Consumer Apps</strong></p>
            </section>
          </div>
        </section>
      </main>

      <footer className="profile-footer">
        <SocialLinks location="footer" />
      </footer>
    </aside>
  )
}

function ProjectPanel({ title, image }: { title: string; image: string }) {
  return (
    <article
      aria-label={title}
      className="project-panel"
    >
      <img src={image} alt={title} />
    </article>
  )
}

function App() {
  const reduceMotion = useReducedMotion()
  const rail = [...projects, ...projects]
  const railRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const pointerY = useRef(0)
  const offset = useRef(0)
  const [loopHeight, setLoopHeight] = useState(0)
  const [translateY, setTranslateY] = useState(0)

  const normalizeOffset = (value: number) => {
    if (!loopHeight) return value
    let next = value
    while (next >= 0) next -= loopHeight
    while (next < -loopHeight) next += loopHeight
    return next
  }

  useEffect(() => {
    const railElement = railRef.current
    if (!railElement) return

    const updateHeight = () => {
      const nextHeight = railElement.scrollHeight / 2
      setLoopHeight(nextHeight)
      offset.current = -nextHeight
      setTranslateY(-nextHeight)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(railElement)
    return () => observer.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    if (reduceMotion || dragging.current || !loopHeight) return
    offset.current = normalizeOffset(offset.current + delta * 0.012)
    setTranslateY(offset.current)
  })

  const moveRail = (amount: number) => {
    offset.current = normalizeOffset(offset.current + amount)
    setTranslateY(offset.current)
  }

  return (
    <div id="top" className="portfolio">
      <Profile />
      <section id="works" className="work" aria-label="Selected work">
        <motion.div
          ref={railRef}
          className="work-rail"
          style={{ y: translateY }}
          onPointerDown={(event) => {
            dragging.current = true
            pointerY.current = event.clientY
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            if (!dragging.current) return
            moveRail(event.clientY - pointerY.current)
            pointerY.current = event.clientY
          }}
          onPointerUp={(event) => {
            dragging.current = false
            event.currentTarget.releasePointerCapture(event.pointerId)
          }}
          onPointerCancel={() => { dragging.current = false }}
          onWheel={(event) => {
            event.preventDefault()
            moveRail(-event.deltaY)
          }}
        >
          {rail.map((project, index) => (
            <ProjectPanel key={`${project.title}-${index}`} {...project} />
          ))}
        </motion.div>
      </section>
    </div>
  )
}

export default App
