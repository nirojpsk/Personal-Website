'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  FileText,
  Maximize2,
  Minimize2,
  Keyboard,
  Minus,
  Plus,
  ScanSearch,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

export default function CvSection() {
  const rootRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<'reader' | 'focus'>('focus')
  const [scale, setScale] = useState(1.15)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewerHeight, setViewerHeight] = useState(680)
  const [viewerBox, setViewerBox] = useState({ width: 0, height: 0 })
  const [fitMode, setFitMode] = useState<'page' | 'width'>('page')
  const [qualityMode, setQualityMode] = useState<'auto' | 'high'>('auto')
  const [showHints, setShowHints] = useState(false)
  const [hotkeysEnabled, setHotkeysEnabled] = useState(false)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [pdfLoading, setPdfLoading] = useState(true)
  const [useIframeFallback, setUseIframeFallback] = useState(false)

  useEffect(() => {
    let canceled = false

    const loadPdf = async () => {
      try {
        setPdfLoading(true)
        setUseIframeFallback(false)

        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString()

        const loadingTask = pdfjsLib.getDocument('/cv.pdf')
        const doc = await loadingTask.promise
        if (canceled) return

        setPdfDoc(doc)
        setTotalPages(doc.numPages || 1)
      } catch {
        if (!canceled) {
          setUseIframeFallback(true)
        }
      } finally {
        if (!canceled) setPdfLoading(false)
      }
    }

    loadPdf()

    return () => {
      canceled = true
    }
  }, [])

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [totalPages])

  useEffect(() => {
    const updateHeight = () => {
      const isMobile = window.innerWidth < 640
      if (isFullscreen) {
        setViewerHeight(window.innerHeight)
        return
      }
      if (isMobile) {
        setViewerHeight(Math.max(420, window.innerHeight - 240))
        return
      }
      setViewerHeight(Math.max(540, Math.min(900, window.innerHeight - 210)))
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [isFullscreen])

  useEffect(() => {
    if (!viewerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      const width = entry.contentRect.width
      const height = entry.contentRect.height
      setViewerBox({ width, height })
    })

    observer.observe(viewerRef.current)
    return () => observer.disconnect()
  }, [viewerHeight])

  useEffect(() => {
    const onFsChange = () => {
      const active = Boolean(document.fullscreenElement)
      setIsFullscreen(active)
      if (active) {
        setMode('focus')
        setFitMode('page')
      }
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
        setScale((z) => Math.min(1.8, Number((z + 0.1).toFixed(2))))
      }
      if (event.key === '-') {
        event.preventDefault()
        setScale((z) => Math.max(0.9, Number((z - 0.1).toFixed(2))))
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
        setScale(1.15)
        setMode('focus')
        setFitMode('page')
        setQualityMode('auto')
      }
      if (event.key.toLowerCase() === 'w') {
        event.preventDefault()
        setFitMode('width')
      }
      if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        setFitMode('page')
      }
      if (event.key.toLowerCase() === 'q') {
        event.preventDefault()
        setQualityMode((q) => (q === 'auto' ? 'high' : 'auto'))
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hotkeysEnabled, isFullscreen, totalPages])

  useEffect(() => {
    let canceled = false
    let renderTask: any = null

    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current || !viewerRef.current || !viewerBox.width || !viewerBox.height) return

      try {
        const currentPage = await pdfDoc.getPage(page)
        if (canceled) return

        const baseViewport = currentPage.getViewport({ scale: 1 })
        const usableWidth = Math.max(260, viewerBox.width - 12)
        const usableHeight = Math.max(260, viewerBox.height - 12)
        const fitWidthScale = usableWidth / baseViewport.width
        const fitHeightScale = usableHeight / baseViewport.height
        const fitScale = fitMode === 'width' ? fitWidthScale : Math.min(fitWidthScale, fitHeightScale)
        const interactiveScale = mode === 'reader' && !isFullscreen ? scale : 1
        const targetScale = Math.max(0.25, fitScale * interactiveScale)
        const clarityBoost = targetScale < 0.85 ? Math.min(2.2, 0.85 / targetScale) : 1
        const renderScale = targetScale * clarityBoost
        const viewport = currentPage.getViewport({ scale: renderScale })

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        if (!context) return

        const isMobile = window.innerWidth < 768
        const dprCap =
          qualityMode === 'high'
            ? isMobile
              ? 3
              : 4
            : isMobile
              ? 2.5
              : viewerBox.width < 900
                ? 3.2
                : 2.7
        const dpr = Math.min(window.devicePixelRatio || 1, dprCap)
        canvas.width = Math.floor(viewport.width * dpr)
        canvas.height = Math.floor(viewport.height * dpr)
        canvas.style.width = `${Math.floor(viewport.width / clarityBoost)}px`
        canvas.style.height = `${Math.floor(viewport.height / clarityBoost)}px`

        context.setTransform(dpr, 0, 0, dpr, 0, 0)
        renderTask = currentPage.render({ canvasContext: context, viewport })
        await renderTask.promise
      } catch {
        if (!canceled) setUseIframeFallback(true)
      }
    }

    renderPage()
    return () => {
      canceled = true
      if (renderTask?.cancel) renderTask.cancel()
    }
  }, [pdfDoc, page, scale, mode, isFullscreen, viewerBox, fitMode, qualityMode])

  const adjustScale = (direction: 'in' | 'out') => {
    setScale((z) => {
      const next = direction === 'in' ? z + 0.1 : z - 0.1
      return Math.max(0.9, Math.min(1.8, Number(next.toFixed(2))))
    })
  }

  const pillBtn =
    'cv-btn-fun group relative overflow-hidden px-3 py-2 rounded-lg text-xs font-mono border transition-all duration-200 hover:-translate-y-0.5 active:scale-95'
  const iconBtn =
    'cv-icon-btn-fun group p-2 rounded-lg border border-border bg-background/75 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-secondary/70 active:scale-95'

  return (
    <section
      id="cv"
      className={`relative min-h-[calc(100dvh-5rem)] ${isFullscreen ? 'py-0' : 'py-3 md:py-4'}`}
    >
      <div className={`${isFullscreen ? 'max-w-none px-0' : 'max-w-6xl mx-auto px-4 sm:px-6'} h-full`}>
        <div
          ref={rootRef}
          tabIndex={0}
          onMouseEnter={() => setHotkeysEnabled(true)}
          onMouseLeave={() => setHotkeysEnabled(false)}
          onFocus={() => setHotkeysEnabled(true)}
          onBlur={() => setHotkeysEnabled(false)}
          className={`reveal visible h-full outline-none flex flex-col ${
            isFullscreen
              ? 'rounded-none border-0 bg-background p-0 gap-0'
              : 'rounded-2xl border border-border bg-card/70 p-3 sm:p-5 gap-3 sm:gap-4'
          }`}
        >
          {!isFullscreen && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="font-mono text-accent text-xs tracking-widest">05. CV</p>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">CV Interactive Viewer</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/75 px-3 py-2 text-sm">
                <FileText className="w-4 h-4 text-accent" />
                <span className="font-mono text-muted-foreground">cv.pdf</span>
              </div>
            </div>
          )}

          {!isFullscreen && (
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
              onClick={() => setFitMode('page')}
              className={`${pillBtn} ${
                fitMode === 'page'
                  ? 'border-accent text-accent bg-accent/12 shadow-[0_8px_20px_oklch(0.75_0.22_150_/_0.12)]'
                  : 'border-border text-muted-foreground bg-background/70 hover:text-foreground'
              }`}
            >
              <Minimize2 className="mr-1 inline-block w-3.5 h-3.5" />
              Fit Page
            </button>
            <button
              onClick={() => setFitMode('width')}
              className={`${pillBtn} ${
                fitMode === 'width'
                  ? 'border-accent text-accent bg-accent/12 shadow-[0_8px_20px_oklch(0.75_0.22_150_/_0.12)]'
                  : 'border-border text-muted-foreground bg-background/70 hover:text-foreground'
              }`}
            >
              <Maximize2 className="mr-1 inline-block w-3.5 h-3.5" />
              Fit Width
            </button>
            <button
              onClick={() => setQualityMode((q) => (q === 'auto' ? 'high' : 'auto'))}
              className={`${pillBtn} ${
                qualityMode === 'high'
                  ? 'border-accent text-accent bg-accent/12 shadow-[0_8px_20px_oklch(0.75_0.22_150_/_0.12)]'
                  : 'border-border text-muted-foreground bg-background/70 hover:text-foreground'
              }`}
            >
              <ScanSearch className="mr-1 inline-block w-3.5 h-3.5" />
              {qualityMode === 'high' ? 'HD' : 'Auto'}
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
              disabled={mode !== 'reader' || isFullscreen}
            >
              <Minus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            </button>
            <span className="text-xs font-mono px-2 text-muted-foreground text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => adjustScale('in')}
              className={iconBtn}
              aria-label="Zoom in"
              disabled={mode !== 'reader' || isFullscreen}
            >
              <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            </button>
            <button
              onClick={() => {
                setPage(1)
                setScale(1.15)
                setMode('focus')
                setFitMode('page')
                setQualityMode('auto')
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
            <a
              href="/cv.pdf"
              download
              className={`${pillBtn} inline-flex items-center justify-center gap-1.5 border-border bg-background/75 text-muted-foreground hover:text-foreground col-span-2 sm:col-auto`}
            >
              <Download className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
              Download CV
            </a>
            </div>
          )}

          {!isFullscreen && showHints && (
            <div className="rounded-xl border border-border bg-background/70 p-3 text-xs font-mono text-muted-foreground grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <span>`Left/Right` : page</span>
              <span>`+/-` : scale viewer</span>
              <span>`F` : fullscreen</span>
              <span>`H` : toggle hints</span>
              <span>`0` : reset</span>
              <span>`W/P` : fit width/page</span>
              <span>`Q` : quality mode</span>
            </div>
          )}

          <div
            className={`relative flex-1 min-h-0 overflow-hidden ${
              isFullscreen ? 'rounded-none border-0 bg-background' : 'rounded-xl border border-border bg-background/80'
            }`}
          >
            {!isFullscreen && (
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-border bg-card/85 text-[11px] font-mono text-muted-foreground z-10">
                <Sparkles className="w-3 h-3 text-accent" />
                CV Live Canvas
              </div>
            )}

            {isFullscreen && (
              <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/80 px-3 py-2 text-xs font-mono text-foreground hover:border-accent/50"
                >
                  <Expand className="w-3.5 h-3.5" />
                  Exit Fullscreen
                </button>
                <a
                  href="/cv.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/80 px-3 py-2 text-xs font-mono text-foreground hover:border-accent/50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            )}

            <div
              ref={viewerRef}
              className={`w-full overflow-x-hidden ${isFullscreen ? 'p-0' : 'p-2 sm:p-3'}`}
              style={{
                height: `${viewerHeight}px`,
                overflowY: fitMode === 'width' ? 'auto' : 'hidden',
              }}
            >
              {pdfLoading && (
                <div className="w-full min-h-[280px] rounded-lg border border-border bg-card/50 grid place-items-center text-sm font-mono text-muted-foreground">
                  Rendering CV preview...
                </div>
              )}

              {!pdfLoading && useIframeFallback && (
                <iframe
                  src="/cv.pdf#toolbar=0&navpanes=0&zoom=page-fit&view=FitH"
                  title="Pranit Karki CV preview"
                  className="w-full h-full rounded-md border border-border bg-white"
                />
              )}

              {!pdfLoading && !useIframeFallback && (
                <div className="flex justify-center">
                  <canvas
                    ref={canvasRef}
                    aria-label="Pranit Karki CV preview"
                    className="rounded-md border border-border bg-white shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
