'use client'

import { useEffect, useCallback } from 'react'

const interactiveMedia = '(min-width: 1024px) and (pointer: fine)'

export function useCursorSpotlight() {
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cards = document.querySelectorAll('.spotlight-container')
    cards.forEach((card) => {
      const rect = (card as HTMLElement).getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      ;(card as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
      ;(card as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
    })
  }, [])

  useEffect(() => {
    if (!window.matchMedia(interactiveMedia).matches) return
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])
}

export function useTiltCard() {
  useEffect(() => {
    const mediaQuery = window.matchMedia(interactiveMedia)
    const maxTilt = 3.5
    let cleanup: (() => void) | undefined

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent
      const el = mouseEvent.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      const x = mouseEvent.clientX - rect.left
      const y = mouseEvent.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -maxTilt
      const rotateY = ((x - centerX) / centerX) * maxTilt
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const handleMouseLeave = (e: Event) => {
      const el = e.currentTarget as HTMLElement
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
    }

    const bind = () => {
      const cards = document.querySelectorAll('.tilt-card')
      cards.forEach((card) => {
        card.addEventListener('mousemove', handleMouseMove)
        card.addEventListener('mouseleave', handleMouseLeave)
      })

      cleanup = () => {
        cards.forEach((card) => {
          card.removeEventListener('mousemove', handleMouseMove)
          card.removeEventListener('mouseleave', handleMouseLeave)
          ;(card as HTMLElement).style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
        })
      }
    }

    if (mediaQuery.matches) {
      bind()
    }

    const handleMediaChange = () => {
      cleanup?.()
      cleanup = undefined
      if (mediaQuery.matches) bind()
    }

    mediaQuery.addEventListener('change', handleMediaChange)

    return () => {
      cleanup?.()
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
  }, [])
}

export function useMagneticButton() {
  useEffect(() => {
    const mediaQuery = window.matchMedia(interactiveMedia)
    let cleanup: (() => void) | undefined

    const handleMove = (e: Event) => {
      const mouseEvent = e as MouseEvent
      const btn = mouseEvent.currentTarget as HTMLElement
      const rect = btn.getBoundingClientRect()
      const x = mouseEvent.clientX - rect.left - rect.width / 2
      const y = mouseEvent.clientY - rect.top - rect.height / 2
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
    }

    const handleLeave = (e: Event) => {
      const btn = e.currentTarget as HTMLElement
      btn.style.transform = 'translate(0, 0)'
    }

    const bind = () => {
      const buttons = document.querySelectorAll('.magnetic-btn')
      buttons.forEach((btn) => {
        btn.addEventListener('mousemove', handleMove)
        btn.addEventListener('mouseleave', handleLeave)
      })

      cleanup = () => {
        buttons.forEach((btn) => {
          btn.removeEventListener('mousemove', handleMove)
          btn.removeEventListener('mouseleave', handleLeave)
          ;(btn as HTMLElement).style.transform = 'translate(0, 0)'
        })
      }
    }

    if (mediaQuery.matches) {
      bind()
    }

    const handleMediaChange = () => {
      cleanup?.()
      cleanup = undefined
      if (mediaQuery.matches) bind()
    }

    mediaQuery.addEventListener('change', handleMediaChange)

    return () => {
      cleanup?.()
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
  }, [])
}
