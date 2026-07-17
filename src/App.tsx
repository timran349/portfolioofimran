import { type ReactNode, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationFrame, useReducedMotion } from 'framer-motion'
import { getCalApi } from '@calcom/embed-react'

type Page = 'home' | 'pricing'
type PricingTab = 'landing' | 'app' | 'custom'
type ThemeMode = 'light' | 'dark'
type PortfolioProject = {
  title: string
  image: string
}

const links = [
  { label: 'Dribbble', href: 'https://dribbble.com/timran' },
  { label: 'X', href: 'https://x.com/Imranio' },
]

const projects: PortfolioProject[] = [
  { title: 'Founders Mine App', image: '/assets/1 Founders Mine App.png' },
  { title: 'Yorble - Smart Email Ai App', image: '/assets/2 Yorble - Smart Email Ai App.png' },
  { title: 'Smart Alarm App', image: '/assets/3 Smart Alarm App.png' },
  { title: 'Nano - Tasks', image: '/assets/4 Nano - Tasks.png' },
  { title: 'Onboarding - Mood app', image: '/assets/5 Onboarding - Mood app.png' },
  { title: 'Crypto Trading - Wallet App', image: '/assets/6 Crypto Trading - Wallet App.png' },
  { title: 'Whisk - Recipe Maker App', image: '/assets/7 Whisk - Recipe Maker App.png' },
  { title: 'Nano - Dashboard', image: '/assets/8 Nano - Dashboard.png' },
  { title: 'Skill-Up Learning App', image: '/assets/9 Skill-Up Learning App.png' },
]

const pricingTabs: Array<{ id: PricingTab; label: string }> = [
  { id: 'landing', label: 'Landing Page' },
  { id: 'app', label: 'Full App Design' },
  { id: 'custom', label: 'Custom' },
]

type PricingCard = {
  title: string
  subtitle: string
  included: string[]
  tags: string[]
  price?: string
  priceLabel?: string
}

function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1350px] px-6 lg:px-8 ${className}`.trim()}>
      {children}
    </div>
  )
}

const pricingContent: Record<PricingTab, PricingCard> = {
  landing: {
    title: 'Landing Page Design',
    price: '$999',
    subtitle: 'Perfect for startups, SaaS products and businesses launching online.',
    included: [
      'Desktop & Mobile Responsive',
      'Custom UI Design',
      'Figma Source File',
      'Up to 5 Pages',
      'Unlimited Revisions',
      'Delivery in 7–10 Days',
    ],
    tags: ['Landing Page', 'SaaS', 'Startup', 'Portfolio', 'Agency', 'Marketing'],
  },
  app: {
    title: 'Full Product Design',
    price: '$2,000',
    subtitle: 'Complete UX/UI design for web or mobile products.',
    included: [
      'UX Research',
      'User Flow',
      'Wireframes',
      'Design System',
      'Desktop & Mobile',
      'Unlimited Revisions',
      'Developer Handoff',
    ],
    tags: ['SaaS', 'Dashboard', 'Mobile App', 'Web App', 'CRM', 'AI'],
  },
  custom: {
    title: 'Custom Project',
    priceLabel: 'Estimated Budget',
    subtitle: 'Tell me your budget and project details. I’ll prepare a custom proposal within 24 hours.',
    included: ['Flexible Scope', 'Unlimited Revisions', 'Tailored Timeline'],
    tags: ['Strategy', 'Product', 'Brand', 'Experiments'],
  },
}

function SocialLinks({ location, activePage, onNavigate }: { location: 'header' | 'footer'; activePage: Page; onNavigate: (page: Page, hash: string) => void }) {
  const footer = location === 'footer'
  const visibleLinks: Array<{ label: string; href: string; page?: Page }> = footer
    ? [...links, { label: 'Email', href: 'mailto:tusharimran092@gmail.com' }]
    : [
        { label: 'Projects', href: '#works', page: 'home' as const },
        { label: 'Pricing', href: '#pricing', page: 'pricing' as const },
        { label: 'Resume', href: '#resume', page: 'home' as const },
      ]

  return (
    <nav className={footer ? 'social-links social-links--footer' : 'social-links'} aria-label={`${location} social links`}>
      {visibleLinks.map(({ label, href, page }) => (
        <a
          key={label}
          href={href}
          className={activePage === page && location !== 'footer' ? 'is-active' : ''}
          onClick={(event) => {
            event.preventDefault()
            if (page) {
              onNavigate(page, href)
            }
          }}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}

function TopNav({ activePage, onNavigate }: { activePage: Page; onNavigate: (page: Page, hash: string) => void }) {
  return (
    <div className="profile-header">
      <a className="wordmark" href="#top" aria-label="Tushar Imran home" onClick={(event) => {
        event.preventDefault()
        onNavigate('home', '#top')
      }}>
        imran
      </a>
      <SocialLinks location="header" activePage={activePage} onNavigate={onNavigate} />
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
}: {
  kind: 'call' | 'message'
  children: string
}) {
  if (kind === 'call') {
    return (
      <button
        className="action-button"
        data-cal-link="https://cal.com/timran/meeting-with-imran"
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
      className="action-button"
      href="https://wa.me/+88001826381938"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="/assets/social-icon.svg" alt="" aria-hidden="true" />
      <span>{children}</span>
    </a>
  )
}

function ThemeToggle({ theme, onToggle }: { theme: ThemeMode; onToggle: () => void }) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDark ? (
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3.75v1.5M12 18.75v1.5M4.75 12H3.25M20.75 12h-1.5M6.4 6.4l-1.06-1.06M18.66 18.66l-1.06-1.06M6.4 17.6l-1.06 1.06M18.66 5.34l-1.06 1.06" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  )
}

function Profile({ activePage, onNavigate, theme, onToggleTheme }: { activePage: Page; onNavigate: (page: Page, hash: string) => void; theme: ThemeMode; onToggleTheme: () => void }) {
  return (
    <aside className="profile" aria-label="About Tushar Imran">
      <TopNav activePage={activePage} onNavigate={onNavigate} />

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
        <div className="footer-top">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <div className="footer-bottom">
          <SocialLinks location="footer" activePage={activePage} onNavigate={onNavigate} />
        </div>
      </footer>
    </aside>
  )
}

function ProjectPanel({ project, onHoverChange }: { project: PortfolioProject; onHoverChange?: (hovered: boolean) => void }) {
  const { title, image } = project

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
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
      />
    </article>
  )
}

function PricingView() {
  const reduceMotion = useReducedMotion()
  const pricingOptions = [pricingContent.landing, pricingContent.app]

  return (
    <motion.div
      className="pricing-view"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: reduceMotion ? 0 : 0.24, ease: 'easeOut' }}
    >
      {pricingOptions.map((option) => (
        <motion.article
          key={option.title}
          className="pricing-card-panel"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.16 }}
        >
          <div className="pricing-card-panel__content">
            <p className="eyebrow">{option.title === 'Landing Page Design' ? '3–4 days' : '3–4 weeks'}</p>
            <h3>{option.title}</h3>
            <p className="pricing-card-panel__price">{option.price}</p>
            <p className="pricing-card-panel__subtitle">{option.subtitle}</p>
            <ul className="pricing-card-panel__list">
              {option.included.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </motion.article>
      ))}
    </motion.div>
  )
}

function App() {
  const reduceMotion = useReducedMotion()
  const rail = [...projects, ...projects]
  const railRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const pointerY = useRef(0)
  const offset = useRef(0)
  const hoverPausedRef = useRef(false)
  const manualPausedRef = useRef(false)
  const resumeTimerRef = useRef<number | null>(null)
  const manualResetTimerRef = useRef<number | null>(null)
  const pausedRef = useRef(false)
  const [loopHeight, setLoopHeight] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [page, setPage] = useState<Page>('home')
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'

    const storedTheme = window.localStorage.getItem('portfolio-theme')
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    (async () => {
      const cal = await getCalApi()
      cal('ui', {})
    })()
  }, [])

  useEffect(() => {
    const syncPage = () => {
      setPage(window.location.hash === '#pricing' ? 'pricing' : 'home')
    }

    syncPage()
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const navigatePage = (nextPage: Page, hash: string) => {
    setPage(nextPage)
    window.history.pushState({}, '', hash || (nextPage === 'pricing' ? '#pricing' : '#top'))
  }

  const normalizeOffset = (value: number) => {
    if (!loopHeight) return value
    let next = value
    while (next >= 0) next -= loopHeight
    while (next < -loopHeight) next += loopHeight
    return next
  }

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

  const syncPauseState = () => {
    const shouldPause = hoverPausedRef.current || manualPausedRef.current
    pausedRef.current = shouldPause

    if (shouldPause) {
      clearResumeTimer()
      return
    }

    clearResumeTimer()
    resumeTimerRef.current = window.setTimeout(() => {
      if (!hoverPausedRef.current && !manualPausedRef.current) {
        pausedRef.current = false
      }
    }, 15000)
  }

  const setHoverPaused = (hovered: boolean) => {
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

  useEffect(() => {
    return () => {
      clearResumeTimer()
      clearManualResetTimer()
    }
  }, [])

  useAnimationFrame((_, delta) => {
    if (reduceMotion || pausedRef.current || dragging.current || !loopHeight) return
    offset.current = normalizeOffset(offset.current + delta * 0.012)
    setTranslateY(offset.current)
  })

  const moveRail = (amount: number) => {
    offset.current = normalizeOffset(offset.current + amount)
    setTranslateY(offset.current)
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <div id="top" className="portfolio">
      <Container className="portfolio-inner">
        <Profile activePage={page} onNavigate={navigatePage} theme={theme} onToggleTheme={toggleTheme} />
        <section id="works" className="work" aria-label="Selected work">
          <AnimatePresence mode="wait">
            {page === 'pricing' ? (
              <PricingView key="pricing" />
            ) : (
              <motion.div
                key="portfolio"
                ref={railRef}
                className="work-rail"
                style={{ y: translateY }}
                onPointerDown={(event) => {
                  dragging.current = true
                  pointerY.current = event.clientY
                  activateManualPause()
                  event.preventDefault()
                  event.currentTarget.setPointerCapture(event.pointerId)
                }}
                onPointerMove={(event) => {
                  if (!dragging.current) return
                  event.preventDefault()
                  activateManualPause()
                  moveRail(event.clientY - pointerY.current)
                  pointerY.current = event.clientY
                }}
                onPointerUp={(event) => {
                  dragging.current = false
                  releaseManualPause()
                  event.currentTarget.releasePointerCapture(event.pointerId)
                }}
                onPointerCancel={() => {
                  dragging.current = false
                  releaseManualPause()
                }}
                onWheel={(event) => {
                  event.preventDefault()
                  activateManualPause()
                  moveRail(-event.deltaY)
                  releaseManualPause()
                }}
              >
                {rail.map((project, index) => (
                  <ProjectPanel key={`${project.title}-${index}`} project={project} onHoverChange={setHoverPaused} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </Container>
    </div>
  )
}

export default App
