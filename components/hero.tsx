'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Braces, Code2, Terminal, Zap } from 'lucide-react'

const roles = [
  'Fullstack Web Developer',
  'React + Next.js Builder',
  'MERN Stack Learner',
  'Clean UI Implementer',
]

const heroModes = {
  build: {
    label: 'Build Mode',
    status: 'status: building useful things',
    chip: 'UI + Backend flow',
    image: '/IMG_6173.jpg',
  },
  play: {
    label: 'Play Mode',
    status: 'status: shipping fun interactions',
    chip: 'Animation + motion',
    image: '/IMG_6172.jpg',
  },
  ship: {
    label: 'Ship Mode',
    status: 'status: polishing and deploying',
    chip: 'Clean + production ready',
    image: '/IMG_6378.jpg',
  },
} as const

type HeroMode = keyof typeof heroModes

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [mode, setMode] = useState<HeroMode>('build')
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [burst, setBurst] = useState(0)
  const [canTilt, setCanTilt] = useState(false)

  useEffect(() => {
    const currentRole = roles[roleIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayed.length < currentRole.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentRole.slice(0, displayed.length + 1))
      }, 60)
    } else if (!isDeleting && displayed.length === currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1400)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentRole.slice(0, displayed.length - 1))
      }, 40)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, roleIndex])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const handleMediaChange = () => {
      const enabled = mediaQuery.matches
      setCanTilt(enabled)
      if (!enabled) {
        setTilt({ x: 0, y: 0 })
      }
    }

    handleMediaChange()
    mediaQuery.addEventListener('change', handleMediaChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
  }, [])

  const cycleMode = () => {
    setBurst((prev) => prev + 1)
    setMode((prev) => {
      if (prev === 'build') return 'play'
      if (prev === 'play') return 'ship'
      return 'build'
    })
  }

  return (
    <section className="relative min-h-screen pt-24 pb-24 md:pt-28 md:pb-16 flex items-start lg:items-center overflow-x-clip">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,transparent_0,transparent_39px,color-mix(in_oklch,var(--border)_80%,transparent)_40px),linear-gradient(to_bottom,transparent_0,transparent_39px,color-mix(in_oklch,var(--border)_80%,transparent)_40px)] bg-[size:40px_40px] opacity-40" />
      <span className="code-float top-[18%] left-[8%] hidden sm:block">{'</>'}</span>
      <span className="code-float top-[30%] right-[10%] hidden md:block" style={{ animationDelay: '1.5s' }}>{'const app = () => {}'}</span>
      <span className="code-float bottom-[20%] left-[12%] hidden md:block" style={{ animationDelay: '3s' }}>{'npm run dev'}</span>
      <span className="code-float bottom-[26%] right-[14%] hidden lg:block" style={{ animationDelay: '2.2s' }}>{'git push origin main'}</span>

      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start lg:items-center overflow-x-clip">
        <div className="order-2 lg:order-1 min-w-0 space-y-5 sm:space-y-7 reveal visible">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-mono text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Available for projects
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.08] text-foreground">
              Build fast, clean,
              <br />
              <span className="text-accent">web-first products</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              I am Niroj, a developer focused on practical UI, backend logic, and delightful
              interactions that feel smooth without overdesign.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm font-mono text-muted-foreground min-h-7 max-w-full overflow-hidden">
            <Terminal className="w-4 h-4 text-accent" />
            <span className="truncate">{displayed}</span>
            <span className="w-[2px] h-5 bg-accent animate-pulse" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="#projects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm"
            >
              <Zap className="w-4 h-4" />
              View Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#fun"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:border-accent/60 transition-colors"
            >
              <Code2 className="w-4 h-4" />
              Fun Zone
            </a>
          </div>

          <div className="sm:hidden flex flex-wrap gap-2">
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Express'].map((chip) => (
              <span key={chip} className="dev-chip">
                {chip}
              </span>
            ))}
          </div>

          <div className="hidden sm:block dev-marquee">
            <div className="dev-marquee-track">
              {[
                'React',
                'Next.js',
                'TypeScript',
                'Node.js',
                'MongoDB',
                'Express',
                'Tailwind',
                'REST API',
                'GitHub',
                'React',
                'Next.js',
                'TypeScript',
                'Node.js',
                'MongoDB',
                'Express',
                'Tailwind',
                'REST API',
                'GitHub',
              ].map((chip, index) => (
                <span key={index} className="dev-chip">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden sm:grid grid-cols-3 gap-3 pt-2">
            {[
              { label: 'Frontend', value: 'React' },
              { label: 'Backend', value: 'Node' },
              { label: 'Database', value: 'MongoDB' },
            ].map((item) => (
              <div key={item.label} className="card-pop rounded-xl border border-border bg-card p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2 min-w-0 reveal visible">
          <div className="w-full rounded-2xl border border-border bg-card overflow-hidden shadow-[0_20px_40px_oklch(0_0_0_/_0.08)] max-w-xl mx-auto lg:max-w-none">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400/70" />
              </div>
              <p className="text-xs font-mono text-muted-foreground">niroj@portfolio</p>
            </div>

            <div className="p-4 md:p-6 space-y-5">
              <div
                className="h-[290px] sm:h-[420px] lg:h-auto lg:aspect-[4/5] rounded-xl overflow-hidden bg-secondary relative select-none transition-transform duration-300"
                style={{
                  transform: canTilt ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'none',
                }}
                onMouseMove={(event) => {
                  if (!canTilt) return
                  const rect = event.currentTarget.getBoundingClientRect()
                  const x = (event.clientX - rect.left) / rect.width
                  const y = (event.clientY - rect.top) / rect.height
                  setTilt({
                    x: (0.5 - y) * 9,
                    y: (x - 0.5) * 11,
                  })
                }}
                onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                onClick={cycleMode}
              >
                <img
                  src={heroModes[mode].image}
                  alt="Niroj profile photo"
                  className="w-full h-full object-cover object-center"
                  onError={(event) => {
                    event.currentTarget.src = 'https://avatars.githubusercontent.com/nirojpsk?v=4'
                  }}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wide border border-border bg-background/75 text-foreground">
                  {heroModes[mode].label}
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wide border border-border bg-background/75 text-foreground">
                  click me
                </div>

                {Array.from({ length: 6 }).map((_, index) => (
                  <span
                    key={`${burst}-${index}`}
                    className="absolute w-1.5 h-1.5 rounded-full bg-white/85 pointer-events-none hidden sm:block"
                    style={{
                      left: `${18 + index * 12}%`,
                      top: `${20 + (index % 3) * 18}%`,
                      animation: `float ${2 + index * 0.25}s ease-in-out infinite`,
                      animationDelay: `${index * 0.1}s`,
                      opacity: 0.5 + (index % 2) * 0.3,
                    }}
                  />
                ))}
              </div>

              <div className="rounded-xl border border-border bg-background p-4 font-mono text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Braces className="w-4 h-4 text-accent" />
                  {heroModes[mode].status}
                </p>
                <p className="mt-2">location: Dharan, Nepal</p>
                <p className="mt-2 text-accent/80">{heroModes[mode].chip}</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(heroModes) as HeroMode[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={`text-xs font-mono px-2 py-2 rounded-lg border transition-all duration-200 ${
                      mode === key
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {heroModes[key].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
