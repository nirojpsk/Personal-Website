'use client'

import React from 'react'
import { House, User, Wrench, FolderGit2, BrainCircuit, Gamepad2, Mail } from 'lucide-react'

type SectionKey = 'home' | 'about' | 'skills' | 'projects' | 'productivity' | 'fun' | 'contact'

type SectionDockProps = {
  activeSection: SectionKey
  onSelect: (section: SectionKey) => void
}

const items: Array<{ key: SectionKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: 'home', label: 'Home', icon: House },
  { key: 'about', label: 'About', icon: User },
  { key: 'skills', label: 'Skills', icon: Wrench },
  { key: 'projects', label: 'Projects', icon: FolderGit2 },
  { key: 'productivity', label: 'Productivity', icon: BrainCircuit },
  { key: 'fun', label: 'Fun', icon: Gamepad2 },
  { key: 'contact', label: 'Contact', icon: Mail },
]

export default function SectionDock({ activeSection, onSelect }: SectionDockProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="dock-wrap">
        {items.map((item) => {
          const isActive = activeSection === item.key
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`dock-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
