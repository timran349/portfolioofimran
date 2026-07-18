import { type ReactNode, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationFrame, useReducedMotion } from 'framer-motion'
import { getCalApi } from '@calcom/embed-react'

type SocialLink = { label: string; href: string; download?: string }
const footerLinks: SocialLink[] = [
  { label: 'Dribbble', href: 'https://dribbble.com/timran' },
  { label: 'Email', href: 'mailto:tusharimran092@gmail.com' },
  { label: 'Resume', href: '/assets/resume-tushar.pdf', download: 'Resume of Tushar.pdf' },
]

type PortfolioProject = {
  title: string
  image: string
  width: number
  height: number
}

const projects: PortfolioProject[] = [
  { title: 'Founders Mine App', image: '/assets/founders-mine.webp', width: 1600, height: 1200 },
  { title: 'Yorble - Smart Email Ai App', image: '/assets/yorble.webp', width: 1600, height: 1200 },
  { title: 'Smart Alarm App', image: '/assets/smart-alarm.webp', width: 1600, height: 1200 },
  { title: 'Nano - Tasks', image: '/assets/nano-tasks.webp', width: 1600, height: 1200 },
  { title: 'Onboarding - Mood app', image: '/assets/mood-onboarding.webp', width: 1600, height: 1200 },
  { title: 'Crypto Trading - Wallet App', image: '/assets/crypto-wallet.webp', width: 1600, height: 1200 },
  { title: 'Whisk - Recipe Maker App', image: '/assets/whisk.webp', width: 1600, height: 1200 },
  { title: 'Nano - Dashboard', image: '/assets/nano-dashboard.webp', width: 1600, height: 1200 },
  { title: 'Skill-Up Learning App', image: '/assets/skill-up.webp', width: 1600, height: 1200 },
]

const CAL_LINK = 'https://cal.com/timran/meeting-with-imran'
const WHATSAPP_LINK = 'https://wa.me/+88001826381938'

function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1350px] px-6 lg:px-8 ${className}`.trim()}>
      {children}
    </div>
  )
}

function SocialLinks() {
  return (
    <nav className="social-links social-links--footer" aria-label="footer social links">
      {footerLinks.map(({ label, href, download }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          download={download}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}

function TopNav() {
  return (
    <div className="profile-header">
      <a className="wordmark" href="#top" aria-label="Tushar Imran home">
        <img src="/assets/logo2.svg" alt="Imran logo" width={88} height={22} />
      </a>
    </div>
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

function ActionButton({
  kind,
  children,
  className = '',
}: {
  kind: 'call' | 'message'
  children: string
  className?: string
}) {
  const classes = `action-button${className ? ` ${className}` : ''}`

  if (kind === 'call') {
    return (
      <button
        className={classes}
        data-cal-link={CAL_LINK}
        data-cal-config='{"layout":"month_view"}'
        type="button"
      >
        <GoogleMeetIcon />
        <span>{children}</span>
      </button>
    )
  }

  return (
    <a
      className={classes}
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="/assets/social-icon.svg" alt="" aria-hidden="true" width={20} height={20} />
      <span>{children}</span>
    </a>
  )
}

function MobileStickyCtas({ visible }: { visible: boolean }) {
  return (
    <div
      className={`mobile-sticky-ctas${visible ? ' is-visible' : ''}`}
      aria-hidden={!visible}
      // Prevent focusing CTAs while the bar is off-screen
      {...(!visible ? { inert: true } : {})}
    >
      <div className="mobile-sticky-ctas__inner">
        <ActionButton kind="call" className="action-button--compact">
          Book a Call
        </ActionButton>
        <ActionButton kind="message" className="action-button--compact">
          Message Me
        </ActionButton>
      </div>
    </div>
  )
}

function Profile() {
  return (
    <aside className="profile" aria-label="About Tushar Imran">
      <TopNav />

      <main className="profile-content">
        <section className="intro" aria-labelledby="name">
          <div className="identity">
            <img
              className="avatar"
              src="/assets/headshot-192.webp"
              srcSet="/assets/headshot-192.webp 1x, /assets/headshot-384.webp 2x"
              alt="Tushar Imran"
              width={96}
              height={96}
              decoding="async"
              fetchPriority="high"
            />
            <div>
              <h1 id="name">Tushar Imran</h1>
              <p>Software Designer</p>
            </div>
          </div>

          <div className="summary">
            <p>Hey I’m Imran, a software designer and creator based in Bangladesh. For over 5 years, I’ve helped founders and teams around the world to create user experiences that are both beautiful and genuinely useful.</p>
            <div className="actions" id="contact">
              <ActionButton kind="call">Book a Call</ActionButton>
              <ActionButton kind="message">Message Me</ActionButton>
            </div>
          </div>

          <div className="timeline">
            <section>
              <h2>Previously</h2>
              <p>Product designer at <strong>Zyft</strong> , <strong>BG Apps</strong> </p>
              
            </section>
            <section>
              <h2>Now</h2>
              <p>Freelancing, experimenting with AI, building <strong>Consumer Apps</strong></p>
            </section>
          </div>
        </section>
      </main>

      <footer className="profile-footer">
        <SocialLinks />
      </footer>
    </aside>
  )
}

function ProjectPanel({
  project,
  onHoverChange,
  priority = false,
}: {
  project: PortfolioProject
  onHoverChange?: (hovered: boolean) => void
  priority?: boolean
}) {
  const { title, image, width, height } = project

  return (
    <article
      aria-label={title}
      className="project-panel"
      onMouseDown={(event) => event.preventDefault()}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
    >
      <img
        src={image}
        alt={title}
        width={width}
        height={height}
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onDragStart={(event) => event.preventDefault()}
      />
    </article>
  )
}

function useIsMobileLayout(breakpoint = 1024) {
  const [isMobileLayout, setIsMobileLayout] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  })

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const onChange = () => setIsMobileLayout(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [breakpoint])

  return isMobileLayout
}

function useStickyMobileCtas(enabled: boolean) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setVisible(false)
      return
    }

    const target = document.getElementById('contact')
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar once the in-page CTAs leave the viewport
        setVisible(!entry.isIntersecting)
      },
      { root: null, threshold: 0, rootMargin: '-8px 0px 0px 0px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [enabled])

  return visible
}

function App() {
  const reduceMotion = useReducedMotion()
  // Match CSS layout break where profile stacks above work and page scrolls natively.
  const isMobileLayout = useIsMobileLayout(1024)
  const showStickyCtas = useStickyMobileCtas(isMobileLayout)
  const rail = isMobileLayout ? projects : [...projects, ...projects]
  const railRef = useRef<HTMLDivElement>(null)
  const offset = useRef(0)
  const hoverPausedRef = useRef(false)
  const manualPausedRef = useRef(false)
  const resumeTimerRef = useRef<number | null>(null)
  const manualResetTimerRef = useRef<number | null>(null)
  const pausedRef = useRef(false)
  const [loopHeight, setLoopHeight] = useState(0)
  const [translateY, setTranslateY] = useState(0)

  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi()
      cal('ui', {})
    })()
  }, [])

  const clearResumeTimer = () => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
  }

  const clearManualResetTimer = () => {
    if (manualResetTimerRef.current) {
      window.clearTimeout(manualResetTimerRef.current)
      manualResetTimerRef.current = null
    }
  }

  const setHoverPaused = (hovered: boolean) => {
    if (isMobileLayout) return
    hoverPausedRef.current = hovered
    if (hovered) {
      pausedRef.current = true
      clearResumeTimer()
      return
    }

    pausedRef.current = true
    clearResumeTimer()
    resumeTimerRef.current = window.setTimeout(() => {
      if (!hoverPausedRef.current && !manualPausedRef.current) {
        pausedRef.current = false
      }
    }, 15000)
  }

  const activateManualPause = () => {
    manualPausedRef.current = true
    pausedRef.current = true
    clearResumeTimer()
  }

  const releaseManualPause = () => {
    clearManualResetTimer()
    manualResetTimerRef.current = window.setTimeout(() => {
      manualPausedRef.current = false
      if (!hoverPausedRef.current) {
        pausedRef.current = true
        clearResumeTimer()
        resumeTimerRef.current = window.setTimeout(() => {
          if (!hoverPausedRef.current && !manualPausedRef.current) {
            pausedRef.current = false
          }
        }, 15000)
      }
    }, 180)
  }

  useEffect(() => {
    // Mobile uses a static stacked list and native page scroll — no infinite rail.
    if (isMobileLayout) {
      offset.current = 0
      setLoopHeight(0)
      setTranslateY(0)
      pausedRef.current = false
      hoverPausedRef.current = false
      manualPausedRef.current = false
      clearResumeTimer()
      clearManualResetTimer()
      return
    }

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
  }, [isMobileLayout])

  useEffect(() => {
    return () => {
      clearResumeTimer()
      clearManualResetTimer()
    }
  }, [])

  useAnimationFrame((_, delta) => {
    if (isMobileLayout || reduceMotion || pausedRef.current || !loopHeight) return
    offset.current = normalizeOffset(offset.current + delta * 0.012)
    setTranslateY(offset.current)
  })

  const normalizeOffset = (value: number) => {
    if (!loopHeight) return value
    let next = value
    while (next >= 0) next -= loopHeight
    while (next < -loopHeight) next += loopHeight
    return next
  }

  const moveRail = (amount: number) => {
    offset.current = normalizeOffset(offset.current + amount)
    setTranslateY(offset.current)
  }

  return (
    <div
      id="top"
      className={`portfolio${showStickyCtas ? ' has-mobile-sticky-ctas' : ''}`}
      onWheel={
        isMobileLayout
          ? undefined
          : (event) => {
              event.preventDefault()
              activateManualPause()
              moveRail(-event.deltaY)
              releaseManualPause()
            }
      }
    >
      <Container className="portfolio-inner">
        <Profile />
        <section id="works" className="work" aria-label="Selected work">
          <AnimatePresence mode="wait">
            <motion.div
              key={isMobileLayout ? 'portfolio-static' : 'portfolio'}
              ref={railRef}
              className={`work-rail${isMobileLayout ? ' work-rail--static' : ''}`}
              style={isMobileLayout ? undefined : { y: translateY }}
              onWheel={
                isMobileLayout
                  ? undefined
                  : (event) => {
                      event.preventDefault()
                      activateManualPause()
                      moveRail(-event.deltaY)
                      releaseManualPause()
                    }
              }
            >
              {rail.map((project, index) => (
                <ProjectPanel
                  key={`${project.title}-${index}`}
                  project={project}
                  onHoverChange={isMobileLayout ? undefined : setHoverPaused}
                  priority={index === 0}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </section>
      </Container>
      {isMobileLayout ? <MobileStickyCtas visible={showStickyCtas} /> : null}
    </div>
  )
}

export default App
