'use client'

import React, { useEffect, useRef, useState } from 'react'
import { GraduationCap, Briefcase, Coffee, Code2, Rocket } from 'lucide-react'

const educationItems = [
  {
    level: 'SEE',
    school: 'Mechi English Boarding School',
    location: 'Maidhar, Jhapa',
    year: '2018',
    score: 'GPA 3.45',
    image: '/mechi.jpg',
    color: 'var(--neon-cyan)',
  },
  {
    level: '+2 Science',
    school: 'Kanchanjunga English Secondary School',
    location: 'Birtamode, Jhapa',
    year: '2020',
    score: 'CGPA 3.53',
    image: '/kanchanjunga.jpg',
    color: 'var(--neon-purple)',
  },
  {
    level: 'Bachelor (BEI)',
    school: 'Purwanchal Campus',
    location: 'Dharan',
    year: '2025',
    score: 'CGPA 3.0',
    image: '/purwanchal.jpg',
    color: 'var(--neon)',
  },
]

const experienceItems = [
  {
    title: '3 Months FullStack Web Development Course',
    institute: 'Broadway Infosys',
    location: 'Kathmandu',
    description: 'Completed a practical fullstack web development course.',
  },
]

function AnimatedCounter({ target, suffix = '' }: { target: number | string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          if (typeof target === 'number') {
            const duration = 1500
            const steps = 40
            const increment = target / steps
            let current = 0
            const timer = setInterval(() => {
              current += increment
              if (current >= target) {
                setCount(target)
                clearInterval(timer)
              } else {
                setCount(Math.floor(current))
              }
            }, duration / steps)
          }
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  const isNumber = typeof target === 'number'

  return (
    <div
      ref={ref}
      className={`font-bold text-accent neon-text font-mono leading-none ${
        isNumber ? 'text-4xl' : 'text-3xl sm:text-4xl'
      }`}
    >
      {isNumber ? count : target}
      {suffix}
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="py-28 relative">
      <div className="absolute top-20 right-0 w-1 h-40 bg-accent/10 rounded-full" />
      <div className="absolute bottom-20 left-0 w-1 h-32 bg-[var(--neon-purple)]/10 rounded-full" />

      <div className="max-w-5xl mx-auto px-6 space-y-16">
        <div className="reveal space-y-4">
          <p className="font-mono text-accent text-sm tracking-widest neon-text">01. ABOUT ME</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Who I Am</h2>
          <div className="w-16 h-[3px] bg-accent rounded-full shadow-[0_0_10px_var(--neon)]" />
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3 space-y-6 reveal">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I&apos;m a junior fullstack web developer with a passion for creating
              intuitive and performant web applications.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              My learning path includes SEE, +2 Science, and a BEI degree from
              Purwanchal Campus, followed by practical training in fullstack web development.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I enjoy turning ideas into clean, interactive web products and improving every day.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { value: 5, suffix: '+', label: 'Projects Built', icon: Rocket },
                { value: 6, suffix: '+', label: 'Technologies', icon: Code2 },
                { value: '∞', suffix: '', label: 'Cups of Coffee', icon: Coffee },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="spotlight-container bg-card/50 border border-border rounded-xl p-5 text-center hover:border-accent/40 transition-all duration-300 overflow-hidden"
                >
                  <stat.icon className="w-5 h-5 text-accent/60 mx-auto mb-2" />
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-8 reveal">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-accent" />
                <p className="font-mono text-xs tracking-widest text-accent">EDUCATION</p>
              </div>

              {educationItems.map((item, i) => (
                <div
                  key={i}
                  className="spotlight-container edu-card bg-card/60 border border-border rounded-xl p-4 hover:border-accent/30 transition-all duration-300"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div className="edu-image-wrap aspect-[16/8] w-full rounded-lg overflow-hidden border border-border/70 mb-3 bg-secondary">
                    <img src={item.image} alt={item.school} className="edu-image w-full h-full object-cover" />
                  </div>
                  <p className="font-mono text-[11px] tracking-widest mb-1" style={{ color: item.color }}>
                    {item.level}
                  </p>
                  <p className="text-foreground font-semibold">{item.school}</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {item.location} | {item.year} | {item.score}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-accent" />
                <p className="font-mono text-xs tracking-widest text-accent">EXPERIENCE</p>
              </div>

              {experienceItems.map((item, i) => (
                <div
                  key={i}
                  className="spotlight-container edu-card bg-card/60 border border-border rounded-xl p-5 hover:border-accent/30 transition-all duration-300"
                  style={{ animationDelay: `${(educationItems.length + i) * 120}ms` }}
                >
                  <p className="text-foreground font-semibold">{item.title}</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {item.institute}, {item.location}
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
