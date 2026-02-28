'use client'

import React, { useMemo, useState } from 'react'
import { Dices, Puzzle, Keyboard, Grid3x3, Gamepad2, Shuffle, ArrowUpRight } from 'lucide-react'

type Game = {
  name: string
  type: 'word' | 'puzzle' | 'arcade'
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const games: Game[] = [
  {
    name: 'Wordle',
    type: 'word',
    description: 'Guess the five-letter word in six tries.',
    href: 'https://www.nytimes.com/games/wordle/index.html',
    icon: Keyboard,
  },
  {
    name: 'Sudoku',
    type: 'puzzle',
    description: 'Classic number puzzle for daily practice.',
    href: 'https://sudoku.com/',
    icon: Grid3x3,
  },
  {
    name: '2048',
    type: 'puzzle',
    description: 'Merge tiles and chase the 2048 block.',
    href: 'https://play2048.co/',
    icon: Puzzle,
  },
  {
    name: 'Tic Tac Toe',
    type: 'arcade',
    description: 'Quick strategy game against browser AI.',
    href: 'https://playtictactoe.org/',
    icon: Gamepad2,
  },
  {
    name: 'Random Name Game',
    type: 'word',
    description: 'Your own random output game from GitHub.',
    href: 'https://random-name-generator-with-user-inp.vercel.app',
    icon: Dices,
  },
]

export default function FunGames() {
  const [activeType, setActiveType] = useState<'all' | 'word' | 'puzzle' | 'arcade'>('all')
  const [picked, setPicked] = useState<Game | null>(null)
  const [clickedCard, setClickedCard] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (activeType === 'all') return games
    return games.filter((game) => game.type === activeType)
  }, [activeType])

  const pickRandomGame = () => {
    const source = filtered.length ? filtered : games
    const random = source[Math.floor(Math.random() * source.length)]
    setPicked(random)
  }

  return (
    <section id="fun" className="py-24 relative fun-stage">
      <span className="fun-float fun-float-a" aria-hidden="true">{'{ }'}</span>
      <span className="fun-float fun-float-b" aria-hidden="true">#</span>

      <div className="max-w-5xl mx-auto px-6 space-y-10">
        <div className="reveal space-y-3">
          <p className="font-mono text-accent text-xs tracking-[0.22em]">05. FUN ZONE</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">Play Break</h2>
          <p className="text-muted-foreground max-w-2xl">
            Short game breaks to reset focus. Word, puzzle, and quick arcade picks.
          </p>
        </div>

        <div className="reveal flex flex-wrap gap-2">
          {(['all', 'word', 'puzzle', 'arcade'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`fun-filter-btn px-3 py-1.5 rounded-lg border text-sm capitalize transition-colors ${
                activeType === type
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {type}
            </button>
          ))}

          <button
            onClick={pickRandomGame}
            className="fun-filter-btn inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm text-foreground bg-card hover:border-accent/60 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Pick Random
          </button>
        </div>

        {picked && (
          <div className="reveal fun-picked p-4 rounded-xl border border-border bg-card/70 flex items-center justify-between gap-4">
            <p className="text-sm text-foreground">
              Try now: <span className="font-semibold">{picked.name}</span> - {picked.description}
            </p>
            <a
              href={picked.href}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium"
            >
              Play
            </a>
          </div>
        )}

        <div className="reveal-stagger grid sm:grid-cols-2 lg:grid-cols-3 gap-4 fun-grid">
          {filtered.map((game) => (
            <a
              key={game.name}
              href={game.href}
              target="_blank"
              rel="noreferrer"
              onMouseDown={() => setClickedCard(game.name)}
              onMouseUp={() => setClickedCard(null)}
              onMouseLeave={() => setClickedCard(null)}
              onTouchStart={() => setClickedCard(game.name)}
              onTouchEnd={() => setTimeout(() => setClickedCard(null), 140)}
              className={`group card-pop fun-card p-5 rounded-xl border border-border bg-card/70 hover:border-accent/40 transition-colors ${
                clickedCard === game.name ? 'fun-card-tap' : ''
              }`}
            >
              <div className="fun-icon-wrap w-10 h-10 rounded-lg border border-border bg-background flex items-center justify-center mb-3">
                <game.icon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-foreground font-semibold">{game.name}</h3>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground fun-go transition-all duration-200" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{game.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-accent/80">{game.type}</p>
                <span className="text-[10px] font-mono text-muted-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  click to play
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
