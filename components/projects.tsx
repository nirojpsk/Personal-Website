'use client'

import React, { useEffect, useState } from 'react'
import { ExternalLink, Github, Folder, Star, ArrowUpRight } from 'lucide-react'

type Project = {
  title: string
  description: string
  technologies: string[]
  liveLink: string
  githubLink: string
  featured: boolean
  color: string
}

type GithubRepo = {
  id: number
  name: string
  html_url: string
  homepage: string | null
  description: string | null
  language: string | null
  stargazers_count: number
  fork: boolean
}

const fallbackProjects: Project[] = [
  {
    title: 'Node Learning Projects',
    description:
      'Simple backend projects made while learning MERN stack fundamentals.',
    technologies: ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
    liveLink: 'https://github.com/nirojpsk/node-learning-projects',
    githubLink: 'https://github.com/nirojpsk/node-learning-projects',
    featured: true,
    color: 'var(--neon)',
  },
  {
    title: 'Broadway Infosys Ecommerce',
    description:
      'First MERN stack e-commerce project built as a learning milestone.',
    technologies: ['JavaScript', 'MERN Stack', 'MongoDB'],
    liveLink: 'https://github.com/nirojpsk/Broadway_infosys_Ecommerce',
    githubLink: 'https://github.com/nirojpsk/Broadway_infosys_Ecommerce',
    featured: true,
    color: 'var(--neon-purple)',
  },
  {
    title: 'Random Name Generator',
    description:
      'Generates randomized outputs from user-provided names with a deployed demo.',
    technologies: ['JavaScript', 'Vercel', 'Frontend'],
    liveLink: 'https://random-name-generator-with-user-inp.vercel.app',
    githubLink: 'https://github.com/nirojpsk/Random-Name-Generator-With-UserInput',
    featured: false,
    color: 'var(--neon-cyan)',
  },
  {
    title: 'My First Chrome Extension',
    description:
      'A beginner Chrome extension project built while learning JavaScript.',
    technologies: ['JavaScript', 'Chrome Extension'],
    liveLink: 'https://github.com/nirojpsk/My-first-Chrome-extension',
    githubLink: 'https://github.com/nirojpsk/My-first-Chrome-extension',
    featured: false,
    color: 'var(--neon-pink)',
  },
  {
    title: 'Faulty Calculator',
    description:
      'A JavaScript practice project inspired by Sigma Web Dev coursework.',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    liveLink: 'https://github.com/nirojpsk/Faulty-Calculator',
    githubLink: 'https://github.com/nirojpsk/Faulty-Calculator',
    featured: false,
    color: 'var(--neon)',
  },
  {
    title: 'Personal Portfolio',
    description:
      'Personal website project showcasing profile, skills, and work.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://pranitkarki.vercel.app',
    githubLink: 'https://github.com/nirojpsk/portfolio',
    featured: false,
    color: 'var(--neon-purple)',
  },
]

const cardColors = ['var(--neon)', 'var(--neon-purple)', 'var(--neon-cyan)', 'var(--neon-pink)']

function toTitle(input: string) {
  return input
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function mapReposToProjects(repos: GithubRepo[]): Project[] {
  return repos
    .filter((repo) => !repo.fork)
    .map((repo, index) => {
      const language = repo.language ? [repo.language] : []
      return {
        title: toTitle(repo.name),
        description: repo.description || 'Project from my GitHub profile.',
        technologies: [...language, 'GitHub'],
        liveLink: repo.homepage && repo.homepage.startsWith('http') ? repo.homepage : repo.html_url,
        githubLink: repo.html_url,
        featured: index < 2,
        color: cardColors[index % cardColors.length],
      }
    })
    .slice(0, 8)
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)

  useEffect(() => {
    let isMounted = true

    const fetchRepos = async () => {
      try {
        const response = await fetch('https://api.github.com/users/nirojpsk/repos?sort=updated&per_page=12')
        if (!response.ok) return
        const repos = (await response.json()) as GithubRepo[]
        const mappedProjects = mapReposToProjects(repos)
        if (isMounted && mappedProjects.length > 0) {
          setProjects(mappedProjects)
        }
      } catch {
        // Keep fallback projects if GitHub API is unavailable.
      }
    }

    fetchRepos()
    return () => {
      isMounted = false
    }
  }, [])

  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="py-28 relative">
      {/* Decorative blob */}
      <div
        className="morph-blob absolute top-40 left-0 w-72 h-72 opacity-[0.04] pointer-events-none"
        style={{ background: 'var(--neon-cyan)', filter: 'blur(80px)' }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-6 space-y-16">
        {/* Section Heading */}
        <div className="reveal space-y-4">
          <p className="font-mono text-accent text-sm tracking-widest neon-text">03. PROJECTS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Featured Projects
          </h2>
          <div className="w-16 h-[3px] bg-accent rounded-full shadow-[0_0_10px_var(--neon)]" />
        </div>

        {/* Featured — 3D Tilt Cards */}
        <div className="space-y-8">
          {featuredProjects.map((project, index) => (
            <div
              key={index}
              className="reveal tilt-card"
            >
              <div className="spotlight-container card-pop bg-card/60 border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300 hover:shadow-[0_10px_40px_oklch(0_0_0_/_0.2)] relative group">
                {/* Color accent top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: project.color }}
                />

                <div className="grid md:grid-cols-5 gap-0">
                  {/* Left panel */}
                  <div className="md:col-span-2 bg-secondary/30 p-8 md:p-10 flex flex-col justify-center items-center relative overflow-hidden">
                    {/* Big number */}
                    <div
                      className="absolute inset-0 flex items-center justify-center font-mono text-[10rem] font-black select-none opacity-[0.03]"
                      style={{ color: project.color }}
                    >
                      0{index + 1}
                    </div>

                    <div className="relative z-10 text-center space-y-5">
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border"
                        style={{
                          background: `color-mix(in oklch, ${project.color} 10%, transparent)`,
                          borderColor: `color-mix(in oklch, ${project.color} 25%, transparent)`,
                          color: project.color,
                        }}
                      >
                        <Star className="w-3 h-3" />
                        FEATURED
                      </div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap justify-center gap-2">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-card/80 text-xs rounded-lg border border-border text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right panel */}
                  <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center space-y-6">
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {project.description}
                    </p>
                    <div className="flex gap-3">
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="magnetic-btn group/link inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_oklch(0.75_0.22_150_/_0.25)]"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
                      </a>
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="magnetic-btn inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl text-sm font-semibold hover:border-accent/40 hover:text-accent transition-all duration-300"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Projects */}
        <div className="space-y-8">
          <h3 className="text-2xl font-semibold text-foreground reveal">
            Other Notable Projects
          </h3>
          <div className="grid sm:grid-cols-2 gap-5 reveal-stagger">
            {otherProjects.map((project, index) => (
              <div
                key={index}
                className="spotlight-container card-pop group bg-card/60 border border-border rounded-xl p-6 hover:border-accent/30 transition-all duration-300 flex flex-col relative overflow-hidden hover:shadow-[0_8px_30px_oklch(0_0_0_/_0.15)]"
              >
                {/* Top color line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                  style={{ background: project.color }}
                />

                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-2.5 rounded-lg border transition-all duration-300"
                    style={{
                      background: `color-mix(in oklch, ${project.color} 10%, transparent)`,
                      borderColor: `color-mix(in oklch, ${project.color} 20%, transparent)`,
                    }}
                  >
                    <Folder className="w-5 h-5" style={{ color: project.color }} />
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110"
                      aria-label="Live demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110"
                      aria-label="Source code"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                  {project.title}
                </h4>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/60">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono text-muted-foreground"
                    >
                      {tech}
                      {i < project.technologies.length - 1 && (
                        <span className="ml-2 text-accent/30">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
