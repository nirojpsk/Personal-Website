'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Monitor, Server, Wrench, BookOpen, Cpu } from 'lucide-react'

const skillCategories = [
  {
    icon: Monitor,
    category: 'Frontend',
    color: 'var(--neon-cyan)',
    skills: [
      { name: 'HTML5', level: 48 },
      { name: 'CSS3', level: 46 },
      { name: 'JavaScript', level: 49 },
      { name: 'React', level: 45 },
      { name: 'Bootstrap', level: 42 },
      { name: 'Tailwind CSS', level: 47 },
      { name: 'Responsive Design', level: 44 },
    ],
  },
  {
    icon: Server,
    category: 'Backend',
    color: 'var(--neon-purple)',
    skills: [
      { name: 'Node.js', level: 44 },
      { name: 'Express.js', level: 43 },
      { name: 'MongoDB', level: 45 },
      { name: 'RESTful APIs', level: 48 },
      { name: 'Authentication', level: 41 },
      { name: 'Database Design', level: 42 },
    ],
  },
  {
    icon: Wrench,
    category: 'Tools & More',
    color: 'var(--neon)',
    skills: [
      { name: 'Git & GitHub', level: 47 },
      { name: 'VS Code', level: 50 },
      { name: 'Figma', level: 40 },
      { name: 'Postman', level: 43 },
      { name: 'npm/yarn', level: 45 },
      { name: 'Problem Solving', level: 49 },
    ],
  },
]

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

function arcPath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, startAngle)
  const end = polarToCartesian(cx, cy, radius, endAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
}

function SkillGauge({
  value,
  color,
}: {
  value: number
  color: string
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const gaugeRef = useRef<HTMLDivElement>(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    const node = gaugeRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animatedRef.current) return
        animatedRef.current = true

        const startTime = performance.now()
        const duration = 1200
        const from = 0
        const to = value

        const tick = (now: number) => {
          const progress = Math.min(1, (now - startTime) / duration)
          const eased = 1 - Math.pow(1 - progress, 3)
          const nextValue = Math.round(from + (to - from) * eased)
          setDisplayValue(nextValue)
          if (progress < 1) {
            requestAnimationFrame(tick)
          }
        }

        requestAnimationFrame(tick)
      },
      { threshold: 0.35 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value])

  const clamped = Math.max(0, Math.min(100, displayValue))
  const needleAngle = -90 + (clamped / 100) * 180
  const cx = 180
  const cy = 170
  const outerRadius = 126
  const innerRadius = 96
  const needleTip = polarToCartesian(cx, cy, 92, needleAngle)
  const needleShaftStart = polarToCartesian(cx, cy, 56, needleAngle)
  const needleShaftEnd = polarToCartesian(cx, cy, 80, needleAngle)
  const needleHeadLeft = polarToCartesian(cx, cy, 84, needleAngle - 5.5)
  const needleHeadRight = polarToCartesian(cx, cy, 84, needleAngle + 5.5)
  const segmentColors = [
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#facc15',
    '#fde047',
    '#a3e635',
    '#84cc16',
    '#4ade80',
    '#22c55e',
    '#16a34a',
  ]

  return (
    <div ref={gaugeRef} className="relative w-full max-w-[360px] mx-auto skill-gauge-wrap">
      <svg viewBox="0 0 360 220" className="w-full h-auto">
        <path
          d={arcPath(cx, cy, outerRadius, -90, 90)}
          fill="none"
          stroke="color-mix(in oklch, var(--border) 75%, transparent)"
          strokeWidth="22"
          strokeLinecap="round"
        />

        {segmentColors.map((segmentColor, index) => {
          const start = -90 + index * 18 + 0.8
          const end = start + 16.4
          return (
            <path
              key={segmentColor + index}
              d={arcPath(cx, cy, outerRadius, start, end)}
              fill="none"
              stroke={segmentColor}
              strokeWidth="22"
              strokeLinecap="round"
            />
          )
        })}

        <path
          d={arcPath(cx, cy, outerRadius, -90, 90)}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          className="skill-gauge-scan"
        />

        <path
          d={arcPath(cx, cy, innerRadius, -90, 90)}
          fill="none"
          stroke="color-mix(in oklch, var(--background) 90%, transparent)"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {Array.from({ length: 21 }).map((_, index) => {
          const pct = index * 5
          const angle = -90 + pct * 1.8
          const outerTick = polarToCartesian(cx, cy, 140, angle)
          const innerTick = polarToCartesian(cx, cy, pct % 10 === 0 ? 124 : 130, angle)
          const labelPoint = polarToCartesian(cx, cy, 107, angle)
          const showLabel = pct % 20 === 0

          return (
            <g key={pct}>
              <line
                x1={outerTick.x}
                y1={outerTick.y}
                x2={innerTick.x}
                y2={innerTick.y}
                stroke="var(--foreground)"
                strokeOpacity={showLabel ? 0.72 : 0.45}
                strokeWidth={showLabel ? 2.2 : 1.2}
                strokeLinecap="round"
              />
              {showLabel && (
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--muted-foreground)"
                  fontSize="9"
                  fontWeight={650}
                  fontFamily="var(--font-mono)"
                >
                  {pct}
                </text>
              )}
            </g>
          )
        })}

        <g className="skill-gauge-needle">
          <line
            x1={needleShaftStart.x}
            y1={needleShaftStart.y}
            x2={needleShaftEnd.x}
            y2={needleShaftEnd.y}
            stroke={color}
            strokeWidth="4.4"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px color-mix(in oklch, ${color} 40%, transparent))` }}
          />
          <polygon
            points={`${needleTip.x},${needleTip.y} ${needleHeadLeft.x},${needleHeadLeft.y} ${needleHeadRight.x},${needleHeadRight.y}`}
            fill={color}
            stroke="white"
            strokeOpacity={0.45}
            strokeWidth="0.8"
          />
        </g>

        <g className="skill-gauge-hub">
          <circle cx={cx} cy={cy} r="16" fill="color-mix(in oklch, var(--card) 92%, transparent)" stroke="color-mix(in oklch, var(--border) 80%, transparent)" strokeWidth="2.5" />
          <circle cx={cx} cy={cy} r="9.5" fill={color} />
          <circle cx={cx} cy={cy} r="4" fill="white" fillOpacity={0.8} />
        </g>

        <text
          x={cx}
          y={146}
          textAnchor="middle"
          fill={color}
          fontSize="50"
          fontWeight="800"
          fontFamily="var(--font-mono)"
          className="skill-gauge-value"
        >
          {clamped}%
        </text>
        <text
          x={cx}
          y={202}
          textAnchor="middle"
          fill="var(--muted-foreground)"
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="1.7"
          fontFamily="var(--font-mono)"
        >
          CURRENT RANGE
        </text>
      </svg>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-28 relative">
      <div className="max-w-5xl mx-auto px-6 space-y-16">
        {/* Section Heading */}
        <div className="reveal space-y-4">
          <p className="font-mono text-accent text-sm tracking-widest neon-text">02. SKILLS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Skills & Expertise
          </h2>
          <div className="w-16 h-[3px] bg-accent rounded-full shadow-[0_0_10px_var(--neon)]" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
          {skillCategories.map((cat, index) => (
            <div
              key={index}
              className="spotlight-container card-pop skill-card group bg-card/60 border border-border rounded-xl p-6 space-y-6 hover:border-accent/30 transition-all duration-300 relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: cat.color }}
              />

              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-lg border transition-all duration-300"
                  style={{
                    background: `color-mix(in oklch, ${cat.color} 10%, transparent)`,
                    borderColor: `color-mix(in oklch, ${cat.color} 20%, transparent)`,
                  }}
                >
                  <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
                </div>
                <h3 className="font-mono text-sm tracking-widest" style={{ color: cat.color }}>
                  {cat.category.toUpperCase()}
                </h3>
              </div>

              <SkillGauge
                value={Math.round(cat.skills.reduce((sum, skill) => sum + skill.level, 0) / cat.skills.length)}
                color={cat.color}
              />

              <div className="space-y-2">
                {cat.skills.map((skill) => (
                  <div key={`${cat.category}-${skill.name}`} className="flex items-center justify-between text-sm">
                    <span className="text-foreground/85">{skill.name}</span>
                    <span className="font-mono text-xs px-2 py-1 rounded-md border border-border bg-background/70">
                      {skill.level}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Learning section */}
        <div className="reveal">
          <div className="spotlight-container bg-card/60 border border-border rounded-xl p-7 flex flex-col md:flex-row items-start md:items-center gap-5 hover:border-accent/30 transition-all duration-300 relative overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div
                className="absolute inset-0 -translate-x-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, oklch(0.75 0.22 150 / 0.03), transparent)',
                  animation: 'shimmer 3s infinite',
                }}
              />
            </div>

            <div className="p-3 bg-accent/10 rounded-xl border border-accent/20 shrink-0">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                Always Learning
                <Cpu className="w-4 h-4 text-[var(--neon-cyan)]" style={{ animation: 'spin-slow 6s linear infinite' }} />
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                I&apos;m committed to continuous learning and staying updated with
                modern web development trends. Right now I&apos;m focused on
                strengthening React, Node.js, APIs, and TypeScript fundamentals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
