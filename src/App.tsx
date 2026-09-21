import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationFrame, useReducedMotion } from 'framer-motion'
import { getCalApi } from '@calcom/embed-react'
import { Analytics } from '@vercel/analytics/react'

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
  tags?: string[]
}

const projects: PortfolioProject[] = [
  { title: 'Founders Mine App', image: '/assets/1 Founders Mine App.png', width: 2560, height: 1920, tags: ['Mobile App', 'Figma', '2025'] },
  { title: 'Yorble - Smart Email Ai App', image: '/assets/2 Yorble - Smart Email Ai App.png', width: 2560, height: 1920, tags: ['AI UX', 'SaaS', '2025'] },
  { title: 'Smart Alarm App', image: '/assets/3 Smart Alarm App.png', width: 2560, height: 1920, tags: ['Mobile UX', 'Micro-interactions'] },
  { title: 'Nano - Tasks', image: '/assets/4 Nano - Tasks.png', width: 2560, height: 1920, tags: ['Productivity', 'iOS UI'] },
  { title: 'Onboarding - Mood app', image: '/assets/5 Onboarding - Mood app.png', width: 2560, height: 1920, tags: ['Onboarding Flow', 'UX Research'] },
  { title: 'Crypto Trading - Wallet App', image: '/assets/6 Crypto Trading - Wallet App.png', width: 2560, height: 1920, tags: ['Fintech', 'Design System'] },
  { title: 'Whisk - Recipe Maker App', image: '/assets/7 Whisk - Recipe Maker App.png', width: 2560, height: 1920, tags: ['Consumer App', 'Mobile UI'] },
  { title: 'Nano - Dashboard', image: '/assets/8 Nano - Dashboard.png', width: 2560, height: 1920, tags: ['Dashboard', 'Analytics UI'] },
  { title: 'Skill-Up Learning App', image: '/assets/9 Skill-Up Learning App.png', width: 2560, height: 1920, tags: ['EdTech', 'Product Design'] },
  { title: 'Financely App', image: '/assets/10 Financely App.png', width: 2560, height: 1920, tags: ['Fintech', 'Mobile App'] },
  { title: 'Energy App', image: '/assets/11 Energy Shot.png', width: 2560, height: 1920, tags: ['Clean Energy', 'Mobile UI'] },
  { title: 'Carbon Dashboard', image: '/assets/12 Carbon Shot.png', width: 2560, height: 1920, tags: ['Sustainability', 'Analytics'] },
  { title: 'Fashion Ecommerce', image: '/assets/13 Fashion Shot.png', width: 2560, height: 1920, tags: ['Ecommerce', 'Web UI'] },
  { title: 'Fashion Mobile App', image: '/assets/14 Fashion Shot Mobile.png', width: 2560, height: 1920, tags: ['Ecommerce', 'Mobile App'] },
  { title: 'Cairo Bank App', image: '/assets/15 Cairo Bank Shot.png', width: 2560, height: 1920, tags: ['Fintech', 'Banking UI'] },
  { title: 'Vault Security App', image: '/assets/16 Vault App.png', width: 2560, height: 1920, tags: ['Security', 'Mobile UI'] },
  { title: 'Banking Dashboard', image: '/assets/17 Bangking Dashboard.png', width: 2560, height: 1920, tags: ['Fintech', 'Dashboard'] },
  { title: 'AI Personal Assistant', image: '/assets/18 Ai Personal Assistant Shot.png', width: 2560, height: 1920, tags: ['AI UX', 'Mobile App'] },
]

const CAL_LINK = 'https://cal.com/timran/meeting-with-imran'
const WHATSAPP_LINK = 'https://wa.me/+88001826381938'

function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1680px] ${className}`.trim()}>
      {children}
    </div>
  )
}

function SocialLinks({ onCopyEmail }: { onCopyEmail: (msg: string) => void }) {
  const reduceMotion = useReducedMotion()

  const handleClickLink = (e: React.MouseEvent<HTMLAnchorElement>, label: string, href: string) => {
    if (label === 'Email') {
      e.preventDefault()
      const email = 'tusharimran092@gmail.com'
      navigator.clipboard.writeText(email).then(() => {
        onCopyEmail('Copied email to clipboard! 📋✨')
      }).catch(() => {
        window.location.href = href
      })
    }
  }

  return (
    <motion.nav
      className="social-links social-links--footer"
      aria-label="footer social links"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {footerLinks.map(({ label, href, download }) => (
        <motion.a
          key={label}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          download={download}
          onClick={(e) => handleClickLink(e, label, href)}
          whileHover={reduceMotion ? undefined : { y: -2, opacity: 0.75, transition: { duration: 0.2 } }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        >
          {label}
        </motion.a>
      ))}
    </motion.nav>
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

let audioCtx: AudioContext | null = null

const SOUND_PRESETS = {
  click: { from: 880, to: 440, peak: 0.13 },
  nav: { from: 1320, to: 760, peak: 0.1 },
}

function triggerTone(ctx: AudioContext, type: 'click' | 'nav') {
  const { from, to, peak } = SOUND_PRESETS[type]
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(from, now)
  osc.frequency.exponentialRampToValueAtTime(to, now + 0.09)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)

  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.14)
}

function playTone(type: 'click' | 'nav' = 'click') {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtxClass) return
      audioCtx = new AudioCtxClass()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => triggerTone(audioCtx!, type)).catch(() => {})
      return
    }
    triggerTone(audioCtx, type)
  } catch {}
}

function unlockAudio() {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtxClass) audioCtx = new AudioCtxClass()
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
  } catch {}
}

function SoundEffects() {
  useEffect(() => {
    const handleFirstPointer = () => unlockAudio()
    document.addEventListener('pointerdown', handleFirstPointer, { once: true })

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      const target = (e.target as HTMLElement)?.closest('a, button, [role="button"]')
      const isNav = !!target?.getAttribute('aria-label')?.match(/^(previous|next|go to)\b/i)
      playTone(isNav ? 'nav' : 'click')
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('pointerdown', handleFirstPointer)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  return null
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [isFinePointer, setIsFinePointer] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    setIsFinePointer(media.matches)

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches)
    }

    try {
      media.addEventListener('change', handleMediaChange)
    } catch {
      media.addListener(handleMediaChange)
    }

    return () => {
      try {
        media.removeEventListener('change', handleMediaChange)
      } catch {
        media.removeListener(handleMediaChange)
      }
    }
  }, [])

  useEffect(() => {
    if (!isFinePointer) return
    const dot = dotRef.current
    if (!dot) return

    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY
    let isMoving = false
    let animId = 0

    const spawnSpark = (x: number, y: number) => {
      const spark = document.createElement('span')
      spark.className = 'spark'
      spark.style.left = `${x}px`
      spark.style.top = `${y}px`

      spark.appendChild(document.createElement('b'))

      for (let i = 0; i < 8; i++) {
        const tick = document.createElement('i')
        tick.style.setProperty('--a', `${i * 45}deg`)
        spark.appendChild(tick)
      }

      document.body.appendChild(spark)
      setTimeout(() => spark.remove(), 450)
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      targetX = e.clientX
      targetY = e.clientY
      if (!isMoving) {
        isMoving = true
        currentX = targetX
        currentY = targetY
      }
      dot.dataset.active = 'true'
      const isHot = !!(e.target as HTMLElement)?.closest('a, button, [role="button"]')
      dot.dataset.hot = String(isHot)
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      targetX = e.clientX
      targetY = e.clientY
      if (!isMoving) {
        isMoving = true
        currentX = targetX
        currentY = targetY
        dot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      }
      dot.dataset.active = 'true'
      spawnSpark(e.clientX, e.clientY)
    }

    const handlePointerLeave = () => {
      dot.dataset.active = 'false'
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.8
      currentY += (targetY - currentY) * 0.8
      dot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      animId = requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('pointerleave', handlePointerLeave)

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointerleave', handlePointerLeave)
      root.classList.remove('has-custom-cursor')
    }
  }, [isFinePointer])

  if (!isFinePointer) return null

  return (
    <div ref={dotRef} className="cursor-dot" aria-hidden="true">
      <img src="/assets/figma-cursor.svg" alt="" width={20} height={22} draggable={false} />
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

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 20L1.40583 14.8642C0.538332 13.3608 0.0824998 11.6567 0.0833332 9.90917C0.0858331 4.44583 4.53166 0 9.99414 0C12.645 0.000833333 15.1333 1.03333 17.005 2.90667C18.8758 4.78 19.9058 7.27 19.905 9.91833C19.9025 15.3825 15.4566 19.8283 9.99414 19.8283C8.33581 19.8275 6.70165 19.4117 5.25415 18.6217L0 20ZM5.49749 16.8275C6.89415 17.6567 8.22748 18.1533 9.99081 18.1542C14.5308 18.1542 18.2291 14.4592 18.2316 9.91667C18.2333 5.365 14.5525 1.675 9.99748 1.67333C5.45415 1.67333 1.75833 5.36833 1.75666 9.91C1.75583 11.7642 2.29916 13.1525 3.21166 14.605L2.37916 17.645L5.49749 16.8275ZM14.9866 12.2742C14.925 12.1708 14.76 12.1092 14.5116 11.985C14.2641 11.8608 13.0466 11.2617 12.8191 11.1792C12.5925 11.0967 12.4275 11.055 12.2616 11.3033C12.0966 11.5508 11.6216 12.1092 11.4775 12.2742C11.3333 12.4392 11.1883 12.46 10.9408 12.3358C10.6933 12.2117 9.89498 11.9508 8.94915 11.1067C8.21331 10.45 7.71582 9.63917 7.57165 9.39083C7.42748 9.14333 7.55665 9.00917 7.67998 8.88583C7.79165 8.775 7.92748 8.59667 8.05165 8.45167C8.17748 8.30833 8.21831 8.205 8.30165 8.03917C8.38415 7.87417 8.34331 7.72917 8.28082 7.605C8.21832 7.48167 7.72332 6.2625 7.51748 5.76667C7.31582 5.28417 7.11165 5.34917 6.95998 5.34167L6.48499 5.33333C6.31999 5.33333 6.05165 5.395 5.82499 5.64333C5.59832 5.89167 4.95832 6.49 4.95832 7.70917C4.95832 8.92833 5.84582 10.1058 5.96915 10.2708C6.09332 10.4358 7.71498 12.9375 10.1991 14.01C10.79 14.265 11.2516 14.4175 11.6108 14.5317C12.2041 14.72 12.7441 14.6933 13.1708 14.63C13.6466 14.5592 14.6358 14.0308 14.8425 13.4525C15.0491 12.8733 15.0491 12.3775 14.9866 12.2742Z"
        fill="currentColor"
      />
    </svg>
  )
}

const FIGMA_COLORS = [
  '#FF5C00', // Figma Orange
  '#0ACF83', // Figma Green
  '#1ABCFE', // Figma Blue
  '#F24E1E', // Figma Red
  '#FF9000', // Figma Warm Orange
  '#A259FF', // Figma Purple
  '#00C6FF', // Cyan
  '#E02020', // Crimson
]

function getRandomColor() {
  return FIGMA_COLORS[Math.floor(Math.random() * FIGMA_COLORS.length)]
}

function getRandomVisitorName() {
  const num = Math.floor(Math.random() * 899) + 100
  return `Visitor #${num}`
}

type RemotePeer = {
  id: string
  x: number
  y: number
  color: string
  name: string
  lastSeen: number
}

function FigmaCursorSvg({ color }: { color: string }) {
  return (
    <svg className="multiplayer-cursor__svg" width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.5 1.5L16 11L9.5 12.5L6.5 18.5L1.5 1.5Z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MultiplayerCursors() {
  const [isFinePointer, setIsFinePointer] = useState(false)
  const [myId] = useState(() => 'peer_' + Math.random().toString(36).substring(2, 9))
  const [myColor] = useState(() => getRandomColor())
  const [myName] = useState(() => getRandomVisitorName())
  const [peers, setPeers] = useState<Record<string, RemotePeer>>({})

  const channelRef = useRef<BroadcastChannel | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    setIsFinePointer(media.matches)

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches)
    }

    try {
      media.addEventListener('change', handleMediaChange)
    } catch {
      media.addListener(handleMediaChange)
    }

    return () => {
      try {
        media.removeEventListener('change', handleMediaChange)
      } catch {
        media.removeListener(handleMediaChange)
      }
    }
  }, [])

  useEffect(() => {
    if (!isFinePointer) return

    // 1. BroadcastChannel for local/multi-tab sync
    try {
      const bc = new BroadcastChannel('imran_portfolio_cursors')
      channelRef.current = bc
      bc.onmessage = (event) => {
        const data = event.data
        if (data && data.id && data.id !== myId) {
          setPeers((prev) => ({
            ...prev,
            [data.id]: {
              ...data,
              lastSeen: Date.now(),
            },
          }))
        }
      }
    } catch {}

    // 2. Simple public WebSocket relay for live web visitors
    try {
      const ws = new WebSocket('wss://socketsbay.com/wss/v2/1/demo/')
      wsRef.current = ws
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data && data.id && data.id !== myId) {
            setPeers((prev) => ({
              ...prev,
              [data.id]: {
                ...data,
                lastSeen: Date.now(),
              },
            }))
          }
        } catch {}
      }
    } catch {}

    // Cleanup inactive peers every 3 seconds
    const interval = setInterval(() => {
      const now = Date.now()
      setPeers((prev) => {
        let changed = false
        const next: Record<string, RemotePeer> = {}
        for (const [id, peer] of Object.entries(prev)) {
          if (now - peer.lastSeen < 6000) {
            next[id] = peer
          } else {
            changed = true
          }
        }
        return changed ? next : prev
      })
    }, 3000)

    return () => {
      clearInterval(interval)
      try {
        channelRef.current?.close()
      } catch {}
      try {
        wsRef.current?.close()
      } catch {}
    }
  }, [myId, isFinePointer])

  // Broadcast position
  const broadcast = useCallback(
    (x: number, y: number) => {
      const msg = {
        id: myId,
        x,
        y,
        color: myColor,
        name: myName,
        lastSeen: Date.now(),
      }

      try {
        channelRef.current?.postMessage(msg)
      } catch {}

      try {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(msg))
        }
      } catch {}
    },
    [myId, myColor, myName]
  )

  // Track mouse movement
  useEffect(() => {
    if (!isFinePointer) return
    let lastTime = 0
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY

      const now = Date.now()
      if (now - lastTime > 40) {
        lastTime = now
        broadcast(x, y)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [broadcast, isFinePointer])

  if (!isFinePointer) return null

  return (
    <>
      {/* Remote visitor cursors */}
      {Object.values(peers).map((peer) => (
        <div
          key={peer.id}
          className="multiplayer-cursor"
          style={{
            transform: `translate3d(${peer.x}px, ${peer.y}px, 0)`,
            ['--peer-color' as string]: peer.color,
          }}
        >
          <FigmaCursorSvg color={peer.color} />
          <div className="multiplayer-cursor__label">
            {peer.name}
          </div>
        </div>
      ))}
    </>
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
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null)
  const reduceMotion = useReducedMotion()

  const handlePointerMove = (e: React.PointerEvent) => {
    const btn = buttonRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    btn.style.setProperty('--mx', `${mx}px`)
    btn.style.setProperty('--my', `${my}px`)

    if (!reduceMotion) {
      const tx = ((mx - rect.width / 2) / (rect.width / 2)) * 3
      const ty = ((my - rect.height / 2) / (rect.height / 2)) * 2
      btn.style.setProperty('--tx', `${tx}px`)
      btn.style.setProperty('--ty', `${ty}px`)
    }
  }

  const handleReset = () => {
    const btn = buttonRef.current
    if (!btn) return
    btn.style.setProperty('--tx', '0px')
    btn.style.setProperty('--ty', '0px')
  }

  const classes = `action-button magnetic-button${className ? ` ${className}` : ''}`

  const content = (
    <>
      <span className="magnetic-button__bg" aria-hidden="true" />
      <span className="magnetic-button__content">
        {kind === 'call' ? (
          <GoogleMeetIcon />
        ) : (
          <WhatsAppIcon className="whatsapp-icon" />
        )}
        <span>{children}</span>
      </span>
    </>
  )

  if (kind === 'call') {
    return (
      <button
        ref={buttonRef as React.RefObject<HTMLButtonElement>}
        className={classes}
        data-cal-link={CAL_LINK}
        data-cal-config='{"layout":"month_view"}'
        type="button"
        onPointerMove={handlePointerMove}
        onPointerLeave={handleReset}
        onBlur={handleReset}
      >
        {content}
      </button>
    )
  }

  return (
    <a
      ref={buttonRef as React.RefObject<HTMLAnchorElement>}
      className={classes}
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={handlePointerMove}
      onPointerLeave={handleReset}
      onBlur={handleReset}
    >
      {content}
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

function Profile({ onCopyEmail }: { onCopyEmail: (msg: string) => void }) {
  const reduceMotion = useReducedMotion()

  return (
    <aside className="profile" aria-label="About Tushar Imran">
      <TopNav />

      <main className="profile-content">
        <motion.section
          className="intro"
          aria-labelledby="name"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="identity"
            initial={reduceMotion ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
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
          </motion.div>

          <motion.div
            className="summary"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>Hey I’m Imran, a software designer and creator based in Bangladesh. For over 5 years, I’ve helped founders and teams around the world to create user experiences that are both beautiful and genuinely useful.</p>
            <div className="actions" id="contact">
              <ActionButton kind="call">Book a Call</ActionButton>
              <ActionButton kind="message">Message Me</ActionButton>
            </div>
          </motion.div>

          <motion.div
            className="timeline"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <section>
              <h2>Previously</h2>
              <p>Product designer at <strong>Zyft</strong> , <strong>BG Apps</strong> </p>
            </section>
            <section>
              <h2>Now</h2>
              <p>Freelancing, experimenting with AI, building <strong>Consumer Apps</strong></p>
            </section>
          </motion.div>
        </motion.section>
      </main>

      <footer className="profile-footer">
        <SocialLinks onCopyEmail={onCopyEmail} />
      </footer>
    </aside>
  )
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 25,
  mass: 0.5,
}

function ProjectPanel({
  project,
  instanceId,
  onSelect,
  onHoverChange,
  priority = false,
  index = 0,
}: {
  project: PortfolioProject
  instanceId: string
  onSelect: () => void
  onHoverChange?: (hovered: boolean) => void
  priority?: boolean
  index?: number
}) {
  const { title, image, width, height, tags } = project
  const reduceMotion = useReducedMotion()
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (pointerStartRef.current) {
      const dx = Math.abs(e.clientX - pointerStartRef.current.x)
      const dy = Math.abs(e.clientY - pointerStartRef.current.y)
      pointerStartRef.current = null
      if (dx > 8 || dy > 8) {
        return
      }
    }
    onSelect()
  }

  return (
    <motion.article
      aria-label={title}
      className="project-panel"
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <motion.img
        layoutId={`portfolio-img-${instanceId}`}
        src={image}
        alt={title}
        width={width}
        height={height}
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        style={{ aspectRatio: `${width} / ${height}` }}
        onDragStart={(event) => event.preventDefault()}
        transition={springTransition}
      />
      {tags && tags.length > 0 && (
        <div className="project-tags">
          {tags.map((tag) => (
            <span key={tag} className="project-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  )
}

function ProjectLightbox({
  project,
  instanceId,
  onClose,
}: {
  project: PortfolioProject
  instanceId: string
  onClose: () => void
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="lightbox-portal"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onPointerDown={onClose}
      onClick={onClose}
    >
      <motion.div
        className="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      />

      <div className="lightbox-content">
        <motion.img
          layoutId={`portfolio-img-${instanceId}`}
          src={project.image}
          alt={project.title}
          width={project.width}
          height={project.height}
          className="lightbox-expanded-img"
          decoding="async"
          fetchPriority="high"
          style={{ aspectRatio: `${project.width} / ${project.height}` }}
          transition={springTransition}
        />
      </div>
    </div>
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
  const wheelMomentumRef = useRef(0)
  const [loopHeight, setLoopHeight] = useState(0)
  const [translateY, setTranslateY] = useState(0)

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  const [activeSelection, setActiveSelection] = useState<{
    projectIndex: number
    instanceId: string
  } | null>(null)

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
    if (isMobileLayout || activeSelection) return
    hoverPausedRef.current = hovered
    if (hovered) {
      pausedRef.current = true
      clearResumeTimer()
      return
    }

    pausedRef.current = true
    clearResumeTimer()
    resumeTimerRef.current = window.setTimeout(() => {
      if (!hoverPausedRef.current && !manualPausedRef.current && !activeSelection) {
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
      if (!hoverPausedRef.current && !activeSelection) {
        pausedRef.current = true
        clearResumeTimer()
        resumeTimerRef.current = window.setTimeout(() => {
          if (!hoverPausedRef.current && !manualPausedRef.current && !activeSelection) {
            pausedRef.current = false
          }
        }, 15000)
      }
    }, 180)
  }

  useEffect(() => {
    if (activeSelection) {
      pausedRef.current = true
    } else if (!hoverPausedRef.current && !manualPausedRef.current) {
      pausedRef.current = false
    }
  }, [activeSelection])

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
    if (isMobileLayout || reduceMotion || !loopHeight) return

    if (!pausedRef.current && !activeSelection) {
      offset.current = normalizeOffset(offset.current + delta * 0.012)
      setTranslateY(offset.current)
    }

    if (Math.abs(wheelMomentumRef.current) > 0.0001 && !activeSelection) {
      offset.current = normalizeOffset(offset.current + wheelMomentumRef.current)
      setTranslateY(offset.current)
      wheelMomentumRef.current *= 0.84
    }
  })

  const normalizeOffset = (value: number) => {
    if (!loopHeight) return value
    let next = value
    while (next >= 0) next -= loopHeight
    while (next < -loopHeight) next += loopHeight
    return next
  }

  const handleWheelScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (activeSelection) return
    event.preventDefault()
    activateManualPause()
    wheelMomentumRef.current += -event.deltaY * 0.05
    wheelMomentumRef.current = Math.max(-24, Math.min(24, wheelMomentumRef.current))
    releaseManualPause()
  }

  const handleSelectProject = (projectIndex: number, instanceId: string) => {
    setActiveSelection({ projectIndex, instanceId })
  }

  const handleCloseLightbox = () => {
    setActiveSelection(null)
  }

  const handlePrevProject = () => {
    if (!activeSelection) return
    const prevProjIndex = (activeSelection.projectIndex - 1 + projects.length) % projects.length
    setActiveSelection({
      projectIndex: prevProjIndex,
      instanceId: `proj-${prevProjIndex}-0`,
    })
  }

  const handleNextProject = () => {
    if (!activeSelection) return
    const nextProjIndex = (activeSelection.projectIndex + 1) % projects.length
    setActiveSelection({
      projectIndex: nextProjIndex,
      instanceId: `proj-${nextProjIndex}-0`,
    })
  }

  return (
    <div
      id="top"
      className={`portfolio${showStickyCtas ? ' has-mobile-sticky-ctas' : ''}`}
      onWheel={isMobileLayout ? undefined : handleWheelScroll}
    >
      <SoundEffects />
      <CustomCursor />
      <MultiplayerCursors />
      <Container className="portfolio-inner">
        <Profile onCopyEmail={showToast} />
        <section id="works" className="work" aria-label="Selected work">
          <AnimatePresence mode="wait">
            <motion.div
              key={isMobileLayout ? 'portfolio-static' : 'portfolio'}
              ref={railRef}
              className={`work-rail${isMobileLayout ? ' work-rail--static' : ''}`}
              style={isMobileLayout ? undefined : { y: translateY }}
            >
              {rail.map((project, index) => {
                const projectIndex = index % projects.length
                const instanceId = `proj-${projectIndex}-${Math.floor(index / projects.length)}`
                return (
                  <ProjectPanel
                    key={instanceId}
                    instanceId={instanceId}
                    project={project}
                    onSelect={() => handleSelectProject(projectIndex, instanceId)}
                    onHoverChange={isMobileLayout ? undefined : setHoverPaused}
                    priority={index === 0}
                    index={index}
                  />
                )
              })}
            </motion.div>
          </AnimatePresence>
        </section>
      </Container>

      <AnimatePresence>
        {activeSelection && (
          <ProjectLightbox
            project={projects[activeSelection.projectIndex]}
            instanceId={activeSelection.instanceId}
            onClose={handleCloseLightbox}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="toast-notification"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {isMobileLayout ? <MobileStickyCtas visible={showStickyCtas} /> : null}
      <Analytics />
    </div>
  )
}

export default App

