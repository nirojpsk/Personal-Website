'use client'

import Header from '@/components/header'
import Hero from '@/components/hero'
import About from '@/components/about'
import Skills from '@/components/skills'
import Projects from '@/components/projects'
import Productivity from '@/components/productivity'
import FunGames from '@/components/fun-games'
import Contact from '@/components/contact'
import Footer from '@/components/footer'
import ParticleBackground from '@/components/particle-background'
import SectionDock from '@/components/section-dock'
import { useCursorSpotlight, useTiltCard, useMagneticButton } from '@/hooks/use-interactions'
import { useEffect, useMemo, useState } from 'react'

type SectionKey = 'home' | 'about' | 'skills' | 'projects' | 'productivity' | 'fun' | 'contact'
const sectionKeys: SectionKey[] = ['home', 'about', 'skills', 'projects', 'productivity', 'fun', 'contact']

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionKey>('home')

  const activeSectionView = useMemo(() => {
    switch (activeSection) {
      case 'about':
        return <About />
      case 'skills':
        return <Skills />
      case 'projects':
        return <Projects />
      case 'productivity':
        return <Productivity />
      case 'fun':
        return <FunGames />
      case 'contact':
        return <Contact />
      default:
        return <Hero />
    }
  }, [activeSection])

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => observer.observe(el))

    // Animate skill bars
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
              setTimeout(() => bar.classList.add('animate'), i * 100)
            })
          }
        })
      },
      { threshold: 0.3 }
    )
    document.querySelectorAll('.skill-bar-container').forEach((el) => barObserver.observe(el))

    return () => {
      observer.disconnect()
      barObserver.disconnect()
    }
  }, [activeSection])

  // Click-only section navigation for internal hash links
  useEffect(() => {
    const handleSectionJump = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      if (href === '#') {
        event.preventDefault()
        setActiveSection('home')
        return
      }

      if (!href.startsWith('#')) return
      const key = href.slice(1) as SectionKey
      if (!sectionKeys.includes(key)) return

      event.preventDefault()
      setActiveSection(key)
    }

    document.addEventListener('click', handleSectionJump)
    return () => document.removeEventListener('click', handleSectionJump)
  }, [])

  // Interactive effects
  useCursorSpotlight()
  useTiltCard()
  useMagneticButton()

  return (
    <>
      <ParticleBackground />
      <div className="tech-grid-overlay" />
      <div className="scanline-overlay" />

      <div className="relative z-10 min-h-screen bg-transparent text-foreground overflow-x-hidden">
        <Header activeSection={activeSection} />
        <main className="pt-20">
          <div key={activeSection} className="section-swap">
            {activeSectionView}
          </div>
        </main>
        <Footer />
        <SectionDock activeSection={activeSection} onSelect={setActiveSection} />
      </div>
    </>
  )
}
