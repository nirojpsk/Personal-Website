'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Sun, Moon, Zap } from 'lucide-react'
import { useTheme } from 'next-themes'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#productivity', label: 'Productivity' },
  { href: '#fun', label: 'Fun' },
  { href: '#contact', label: 'Contact' },
]

type HeaderProps = {
  activeSection?: 'home' | 'about' | 'skills' | 'projects' | 'productivity' | 'fun' | 'contact'
}

export default function Header({ activeSection }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-[0_4px_30px_oklch(0_0_0_/_0.1)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="#"
            className="magnetic-btn logo-pill inline-flex items-center rounded-xl transition-transform duration-200 hover:scale-[1.03]"
          >
            <img src="/logo.svg" alt="Pranit Karki logo" className="logo-mark h-11 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1 items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 group ${
                  activeSection === link.href.slice(1)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                {/* Animated underline */}
                <span
                  className={`absolute bottom-0 left-1/2 h-[2px] bg-accent -translate-x-1/2 transition-all duration-300 shadow-[0_0_8px_var(--neon)] ${
                    activeSection === link.href.slice(1) ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-border bg-card/60 hover:border-accent/30 transition-all duration-300 hover:shadow-[0_0_15px_oklch(0.75_0.22_150_/_0.1)]"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-muted-foreground hover:text-accent transition-colors" />
                ) : (
                  <Moon className="w-4 h-4 text-muted-foreground hover:text-accent transition-colors" />
                )}
              </button>
            )}

            {/* CTA */}
            <a
              href="mailto:karkibri2073@gmail.com"
              className="magnetic-btn hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_oklch(0.75_0.22_150_/_0.3)]"
            >
              <Zap className="w-3.5 h-3.5" />
              Hire Me
            </a>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl border border-border bg-card/60 hover:border-accent/30 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/98 backdrop-blur-2xl transition-all duration-400 md:hidden flex flex-col items-center justify-center gap-3 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={`text-3xl font-bold text-foreground hover:text-accent transition-all duration-300 py-3 ${
              mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: mobileOpen ? `${i * 80 + 100}ms` : '0ms' }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="mailto:karkibri2073@gmail.com"
          onClick={() => setMobileOpen(false)}
          className={`mt-8 px-10 py-4 bg-accent text-accent-foreground rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.75_0.22_150_/_0.3)] flex items-center gap-2 ${
            mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: mobileOpen ? `${navLinks.length * 80 + 100}ms` : '0ms' }}
        >
          <Zap className="w-5 h-5" />
          Hire Me
        </a>
      </div>
    </>
  )
}

