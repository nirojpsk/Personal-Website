'use client'

import React from 'react'
import { Mail, Github, Linkedin, ExternalLink, ArrowUpRight, Send, Sparkles, MessageSquare } from 'lucide-react'

const socialLinks = [
  {
    icon: Mail,
    label: 'Email',
    value: 'karkibri2073@gmail.com',
    href: 'mailto:karkibri2073@gmail.com',
    external: false,
    color: 'var(--neon)',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/pranitkarki',
    href: 'https://github.com',
    external: true,
    color: 'var(--neon-purple)',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/pranit-karki-456433279/',
    href: 'https://www.linkedin.com/in/pranit-karki-456433279/',
    external: true,
    color: 'var(--neon-cyan)',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="relative pt-20 pb-36 md:py-28 overflow-x-clip">
      {/* Decorative blobs */}
      <div
        className="morph-blob absolute bottom-0 right-0 w-96 h-96 opacity-[0.04] pointer-events-none"
        style={{ background: 'var(--neon)', filter: 'blur(80px)' }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10 md:space-y-16">
        {/* Section Heading */}
        <div className="reveal space-y-4">
          <p className="font-mono text-accent text-sm tracking-widest">07. CONTACT</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Get In Touch
          </h2>
          <div className="w-16 h-[3px] bg-accent rounded-full shadow-[0_0_10px_var(--neon)]" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left — Description & Social */}
          <div className="space-y-8 reveal">
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                I&apos;m always interested in hearing about new projects and
                opportunities. Whether you have a question or just want to say
                hello, feel free to reach out!
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                I&apos;m based in <span className="text-foreground font-medium">Jhapa, Nepal</span>, and available for
                remote work, freelance projects, and full-time positions.
              </p>
            </div>

            <div className="space-y-3">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="spotlight-container card-pop group flex items-start sm:items-center gap-3 sm:gap-4 p-4 bg-card/60 border border-border rounded-xl hover:border-accent/30 transition-all duration-300 hover:shadow-[0_5px_20px_oklch(0_0_0_/_0.1)] relative overflow-hidden"
                >
                  {/* Accent bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl"
                    style={{ background: link.color }}
                  />

                  <div
                    className="p-2.5 rounded-lg border transition-all duration-300"
                    style={{
                      background: `color-mix(in oklch, ${link.color} 10%, transparent)`,
                      borderColor: `color-mix(in oklch, ${link.color} 20%, transparent)`,
                    }}
                  >
                    <link.icon className="w-5 h-5" style={{ color: link.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {link.label}
                    </p>
                    <p className="text-foreground font-semibold break-all leading-snug">
                      {link.value}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 mt-0.5 sm:mt-0 shrink-0 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Right — CTA Card */}
          <div className="reveal">
            <div className="spotlight-container card-pop bg-card/60 border border-border rounded-2xl p-5 sm:p-8 space-y-6 sm:space-y-8 relative overflow-hidden hover:border-accent/30 transition-all duration-300">
              {/* Corner decoration */}
              <div className="absolute top-4 right-4">
                <MessageSquare className="w-20 h-20 text-accent/[0.05]" />
              </div>

              <div className="space-y-3 relative">
                <div className="inline-flex items-center gap-2 text-accent mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-mono text-xs tracking-widest">LET&apos;S COLLABORATE</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  Build Something Amazing
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Have an exciting opportunity or just want to chat about web
                  development? I&apos;d love to hear from you.
                </p>
              </div>

              <a
                href="mailto:karkibri2073@gmail.com"
                className="magnetic-btn group flex items-center justify-center gap-3 w-full px-5 sm:px-8 py-4 bg-accent text-accent-foreground rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.75_0.22_150_/_0.3)]"
              >
                <Send className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                Send Me an Email
              </a>

              {/* Quick links */}
              <div className="border-t border-border/60 pt-6 space-y-1.5">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-mono">Quick Links</p>
                {[
                  { label: 'View Projects', href: '#projects' },
                  { label: 'Productivity Hub', href: '#productivity' },
                  { label: 'View Skills', href: '#skills' },
                  { label: 'View CV', href: '#cv' },
                  { label: 'Play Games', href: '#fun' },
                  { label: 'About Me', href: '#about' },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4 text-accent group-hover:translate-x-0.5 transition-transform duration-200" />
                    <span className="text-sm text-foreground group-hover:text-accent transition-colors duration-200">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

