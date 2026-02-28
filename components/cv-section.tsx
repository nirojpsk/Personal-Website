'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  FileText,
  Keyboard,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

export default function CvSection() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'reader' | 'focus'>('reader')
  const [scale, setScale] = useState(1)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewerHeight, setViewerHeight] = useState(680)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [hotkeysEnabled, setHotkeysEnabled] = useState(false)

  useEffect(() => {
    let canceled = false

    const detectPages = async () => {
      try {
        const response = await fetch('/cv.pdf')
        const buffer = await response.arrayBuffer()
        const text = new TextDecoder('latin1').decode(buffer)
        const pageObjects = text.match(/\/Type\s*\/Page\b/g)?.length ?? 0
        const countValues = Array.from(text.matchAll(/\/Count\s+(\d+)/g))
          .map((m) => Number.parseInt(m[1], 10))
          .filter((value) => Number.isFinite(value) && value > 0 && value < 300)
        const treeCount = countValues.length ? Math.max(...countValues) : 0
        const count = Math.max(1, pageObjects, treeCount)
        if (!canceled) setTotalPages(Math.max(1, Math.min(count, 120)))
      } catch {
        if (!canceled) setTotalPages(1)
      }
    }

    detectPages()
    return () => {
      canceled = true
    }
  }, [])

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [totalPages])

  useEffect(() => {
    const resize = () => {
      const isMobile = window.innerWidth < 640
      const offset = isFullscreen ? 120 : isMobile ? 248 : mode === 'focus' ? 170 : 216
      const baseHeight = Math.max(420, window.innerHeight - offset)
      setViewerHeight(Math.round(baseHeight * scale))
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [isFullscreen, mode, scale])

  useEffect(() => {
    const onFsChange = () => {
      const active = Boolean(document.fullscreenElement)
      setIsFullscreen(active)
      if (active) setMode('focus')
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const toggleFullscreen = async () => {
    if (!rootRef.current) return
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    await rootRef.current.requestFullscreen()
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!hotkeysEnabled && !isFullscreen) return

      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setPage((p) => Math.min(totalPages, p + 1))
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setPage((p) => Math.max(1, p - 1))
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault()
        setScale((z) => Math.min(1.4, Number((z + 0.1).toFixed(2))))
      }
      if (event.key === '-') {
        event.preventDefault()
        setScale((z) => Math.max(0.8, Number((z - 0.1).toFixed(2))))
      }
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        void toggleFullscreen()
      }
      if (event.key.toLowerCase() === 'h') {
        event.preventDefault()
        setShowHints((prev) => !prev)
      }
      if (event.key === '0') {
        event.preventDefault()
        setPage(1)
        setScale(1)
        setMode('reader')
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hotkeysEnabled, isFullscreen, totalPages])

  const pdfSrc = useMemo(
    () => `/cv.pdf#toolbar=0&navpanes=0&scrollbar=1&page=${page}&zoom=page-width&view=FitH`,
    [page]
  )

  const adjustScale = (direction: 'in' | 'out') => {
    setScale((z) => {
      const next = direction === 'in' ? z + 0.1 : z - 0.1
      return Math.max(0.8, Math.min(1.4, Number(next.toFixed(2))))
    })
  }

  const pillBtn =
    'cv-btn-fun group relative overflow-hidden px-3 py-2 rounded-lg text-xs font-mono border transition-all duration-200 hover:-translate-y-0.5 active:scale-95'
  const iconBtn =
    'cv-icon-btn-fun group p-2 rounded-lg border border-border bg-background/75 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-secondary/70 active:scale-95'

  return (
    <section id="cv" className="relative min-h-[calc(100dvh-5rem)] py-3 md:py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full">
        <div
          ref={rootRef}
          tabIndex={0}
          onMouseEnter={() => setHotkeysEnabled(true)}
          onMouseLeave={() => setHotkeysEnabled(false)}
          onFocus={() => setHotkeysEnabled(true)}
          onBlur={() => setHotkeysEnabled(false)}
          className="reveal visible h-full rounded-2xl border border-border bg-card/70 p-3 sm:p-5 flex flex-col gap-3 sm:gap-4 outline-none"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="font-mono text-accent text-xs tracking-widest">07. CV</p>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">CV Interactive Viewer</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/75 px-3 py-2 text-sm">
              <FileText className="w-4 h-4 text-accent" />
              <span className="font-mono text-muted-foreground">cv.pdf</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
            <button
              onClick={() => setMode('reader')}
              className={`${pillBtn} ${
                mode === 'reader'
                  ? 'border-accent text-accent bg-accent/12 shadow-[0_8px_20px_oklch(0.75_0.22_150_/_0.12)]'
                  : 'border-border text-muted-foreground bg-background/70 hover:text-foreground'
              }`}
            >
              Reader
            </button>
            <button
              onClick={() => setMode('focus')}
              className={`${pillBtn} ${
                mode === 'focus'
                  ? 'border-accent text-accent bg-accent/12 shadow-[0_8px_20px_oklch(0.75_0.22_150_/_0.12)]'
                  : 'border-border text-muted-foreground bg-background/70 hover:text-foreground'
              }`}
            >
              Focus
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={iconBtn}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </button>
            <span className="text-xs font-mono px-2 text-muted-foreground text-center">Page {page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={iconBtn}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => adjustScale('out')}
              className={iconBtn}
              aria-label="Zoom out"
            >
              <Minus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            </button>
            <span className="text-xs font-mono px-2 text-muted-foreground text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => adjustScale('in')}
              className={iconBtn}
              aria-label="Zoom in"
            >
              <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            </button>
            <button
              onClick={() => {
                setPage(1)
                setScale(1)
                setMode('reader')
              }}
              className={`${pillBtn} inline-flex items-center justify-center gap-1.5 border-border bg-background/75 text-muted-foreground hover:text-foreground`}
            >
              <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-45" />
              Reset
            </button>
            <button
              onClick={() => setShowHints((prev) => !prev)}
              className={`${pillBtn} inline-flex items-center justify-center gap-1.5 ${
                showHints
                  ? 'border-accent text-accent bg-accent/12 shadow-[0_8px_20px_oklch(0.75_0.22_150_/_0.12)]'
                  : 'border-border text-muted-foreground bg-background/75 hover:text-foreground'
              }`}
            >
              <Keyboard className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              Keys
            </button>
            <button
              onClick={toggleFullscreen}
              className={`${pillBtn} inline-flex items-center justify-center gap-1.5 border-border bg-background/75 text-muted-foreground hover:text-foreground col-span-2 sm:col-auto`}
            >
              <Expand className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>

          {showHints && (
            <div className="rounded-xl border border-border bg-background/70 p-3 text-xs font-mono text-muted-foreground grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <span>`Left/Right` : page</span>
              <span>`+/-` : scale viewer</span>
              <span>`F` : fullscreen</span>
              <span>`H` : toggle hints</span>
              <span>`0` : reset</span>
            </div>
          )}

          <div className="relative flex-1 min-h-0 rounded-xl border border-border bg-background/80 overflow-hidden">
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-border bg-card/85 text-[11px] font-mono text-muted-foreground z-10">
              <Sparkles className="w-3 h-3 text-accent" />
              CV Live Canvas
            </div>

            <iframe
              title="Pranit Karki CV"
              src={pdfSrc}
              className="w-full border-0 transition-all duration-300"
              style={{ height: `${viewerHeight}px` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
