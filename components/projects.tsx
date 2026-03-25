'use client'

import React, { useEffect, useState } from 'react'
import { ExternalLink, Github, Folder, ArrowUpRight } from 'lucide-react'

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
const permanentFeaturedRepoKeywords = ['devhire', 'todo']
const permanentLiveLinks: Record<string, string> = {
  devhire: 'https://devhire-plum.vercel.app',
}

function toTitle(input: string) {
  return input
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function normalizeRepoName(input: string) {
  return input.toLowerCase().replace(/[-_\s]+/g, '')
}

function isPermanentFeaturedRepo(repoName: string, keyword: string) {
  const normalizedName = normalizeRepoName(repoName)
  const normalizedKeyword = normalizeRepoName(keyword)
  return normalizedName === normalizedKeyword || normalizedName.includes(normalizedKeyword)
}

function resolveLiveLink(repo: GithubRepo) {
  for (const [keyword, liveLink] of Object.entries(permanentLiveLinks)) {
    if (isPermanentFeaturedRepo(repo.name, keyword)) {
      return liveLink
    }
  }

  return repo.homepage && repo.homepage.startsWith('http') ? repo.homepage : repo.html_url
}

function mapReposToProjects(repos: GithubRepo[]): Project[] {
  type RepoProject = Project & { repoId: number; repoName: string }

  const mappedProjects: RepoProject[] = repos
    .filter((repo) => !repo.fork)
    .map((repo) => {
      const language = repo.language ? [repo.language] : []
      return {
        repoId: repo.id,
        repoName: repo.name,
        title: toTitle(repo.name),
        description: repo.description || 'Project from my GitHub profile.',
        technologies: [...language, 'GitHub'],
        liveLink: resolveLiveLink(repo),
        githubLink: repo.html_url,
        featured: false,
        color: 'var(--neon)',
      }
    })

  const usedRepoIds = new Set<number>()
  const permanentFeaturedProjects: RepoProject[] = []

  for (const keyword of permanentFeaturedRepoKeywords) {
    const matchedProject = mappedProjects.find(
      (project) =>
        !usedRepoIds.has(project.repoId) && isPermanentFeaturedRepo(project.repoName, keyword)
    )

    if (!matchedProject) continue

    usedRepoIds.add(matchedProject.repoId)
    permanentFeaturedProjects.push(matchedProject)
  }

  const remainingProjects = mappedProjects.filter((project) => !usedRepoIds.has(project.repoId))
  const fallbackFeaturedCount = Math.max(0, 2 - permanentFeaturedProjects.length)
  const fallbackFeaturedProjects = remainingProjects.slice(0, fallbackFeaturedCount)
  const otherProjects = remainingProjects.slice(fallbackFeaturedCount)

  const orderedProjects = [
    ...permanentFeaturedProjects.map((project) => ({ ...project, featured: true })),
    ...fallbackFeaturedProjects.map((project) => ({ ...project, featured: true })),
    ...otherProjects.map((project) => ({ ...project, featured: false })),
  ].slice(0, 8)

  return orderedProjects.map((project, index) => {
    const { repoId: _repoId, repoName: _repoName, ...projectData } = project
    return {
      ...projectData,
      color: cardColors[index % cardColors.length],
    }
  })
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)

  useEffect(() => {
    let isMounted = true

    const fetchRepos = async () => {
      try {
        const response = await fetch('https://api.github.com/users/nirojpsk/repos?sort=updated&per_page=100')
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
    <section id="projects" className="relative py-24 md:py-28">
      <div className="mx-auto max-w-6xl space-y-14 px-6">
        <div className="reveal visible space-y-4">
          <p className="font-mono text-accent text-sm tracking-widest neon-text">03. PROJECTS</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Featured Projects
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A focused selection of projects that represent my strongest full-stack work.
          </p>
        </div>

        <div className="space-y-5">
          {featuredProjects.map((project, index) => (
            <article
              key={project.githubLink}
              className="reveal visible rounded-2xl border border-border/80 bg-card/70 p-6 shadow-[0_14px_30px_oklch(0_0_0_/_0.08)] transition-all duration-300 hover:border-border hover:bg-card/85 hover:shadow-[0_18px_36px_oklch(0_0_0_/_0.12)] md:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.08em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: project.color }} />
                  Featured {String(index + 1).padStart(2, '0')}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background/70 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    Live
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background/70 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    Code
                    <Github className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {project.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span
                    key={`${project.title}-${tech}-${i}`}
                    className="rounded-md border border-border bg-background/60 px-2.5 py-1 text-xs font-mono text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="magnetic-btn inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-accent/35 hover:bg-card/80"
                >
                  View Project
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </a>
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="magnetic-btn inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-5 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-accent/30"
                >
                  <Github className="h-4 w-4 text-muted-foreground" />
                  View Code
                </a>
              </div>
            </article>
          ))}
        </div>

        {otherProjects.length > 0 && (
          <div className="space-y-6 pt-2">
            <div className="reveal visible space-y-1">
              <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                Additional Projects
              </h3>
              <p className="text-sm text-muted-foreground sm:text-base">
                More builds, experiments, and learning milestones.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 reveal-stagger visible">
              {otherProjects.map((project) => (
                <article
                  key={project.githubLink}
                  className="group rounded-xl border border-border/80 bg-card/60 p-5 transition-all duration-300 hover:border-border hover:bg-card/80"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 rounded-md border border-border bg-background/70 p-2">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-lg font-semibold text-foreground">
                          {project.title}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-border bg-background/70 p-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                        aria-label={`Live demo for ${project.title}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-border bg-background/70 p-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                        aria-label={`Source code for ${project.title}`}
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-3">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={`${project.title}-${tech}-${i}`}
                        className="text-xs font-mono text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
