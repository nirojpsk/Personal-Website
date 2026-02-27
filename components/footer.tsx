'use client'

import React from 'react'
import { Github, Linkedin, Mail, ArrowUp, Copy } from 'lucide-react'

const socialIcons = [
  { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'var(--neon)' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/pranit-karki-456433279/', label: 'LinkedIn', color: 'var(--neon-cyan)' },
  { icon: Mail, href: 'mailto:karkibri2073@gmail.com', label: 'Email', color: 'var(--neon-purple)' },
]

const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Productivity', href: '#productivity' },
  { label: 'Fun', href: '#fun' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-border bg-card/30">
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={scrollToTop}
          className="magnetic-btn p-3 bg-accent text-accent-foreground rounded-full transition-all duration-300 group hover:shadow-[0_0_25px_oklch(0.75_0.22_150_/_0.4)]"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-16 pb-10 space-y-10">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="logo-pill inline-flex items-center rounded-xl">
              <img src="/logo.svg" alt="Pranit Karki logo" className="logo-mark h-10 w-auto" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Fullstack web developer crafting modern, dynamic web experiences
              from Jhapa, Nepal.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Navigate
            </h4>
            <div className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-accent hover:translate-x-1 transition-all duration-200 text-sm w-fit"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="p-3 rounded-xl border border-border bg-card/60 transition-all duration-300 hover:scale-110"
                  style={{ boxShadow: 'none' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = social.color
                    ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px color-mix(in oklch, ${social.color} 30%, transparent)`
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = ''
                    ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  }}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} Pranit Karki. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">Built with React and Next.js</p>
        </div>
      </div>
    </footer>
  )
}

