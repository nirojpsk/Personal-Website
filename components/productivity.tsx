'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CloudSun,
  Droplets,
  Gauge,
  Lightbulb,
  Loader2,
  MapPin,
  Newspaper,
  Quote,
  RefreshCcw,
  Search,
  Sparkles,
  Sunrise,
  Thermometer,
  Wind,
} from 'lucide-react'

type WeatherData = {
  city: string
  country: string
  temperature: number
  feelsLike: number
  humidity: number
  wind: number
  pressure: number
  precipitation: number
  weatherCode: number
  isDay: number
  sunrise?: string
  sunset?: string
}

type QuoteData = {
  text: string
  author: string
}

type FactData = {
  title: string
  text: string
  image: string
  link?: string
}

type NewsTopic = 'world' | 'technology' | 'business' | 'science' | 'sport'

type NewsItem = {
  id: string
  title: string
  url: string
  summary: string
  image?: string
  published: string
}

const fallbackQuotes: QuoteData[] = [
  { text: 'Programs must be written for people to read.', author: 'Harold Abelson' },
  { text: 'The only way to learn a new programming language is by writing programs in it.', author: 'Dennis Ritchie' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'The function of good software is to make the complex appear simple.', author: 'Grady Booch' },
]

const topicOptions: { label: string; value: NewsTopic }[] = [
  { label: 'World', value: 'world' },
  { label: 'Technology', value: 'technology' },
  { label: 'Business', value: 'business' },
  { label: 'Science', value: 'science' },
  { label: 'Sports', value: 'sport' },
]

function weatherCodeLabel(code: number) {
  if (code === 0) return 'Clear sky'
  if ([1, 2, 3].includes(code)) return 'Partly cloudy'
  if ([45, 48].includes(code)) return 'Foggy'
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle'
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rain'
  if ([71, 73, 75, 77].includes(code)) return 'Snow'
  if ([80, 81, 82].includes(code)) return 'Rain showers'
  if ([95, 96, 99].includes(code)) return 'Thunderstorm'
  return 'Variable weather'
}

function cleanText(html: string) {
  return html.replace(/<[^>]*>/g, '').trim()
}

function formatTime(iso?: string) {
  if (!iso) return '--'
  const date = new Date(iso)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Productivity() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherCity, setWeatherCity] = useState('Dharan')
  const [weatherInput, setWeatherInput] = useState('Dharan')
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  const [quote, setQuote] = useState<QuoteData>(fallbackQuotes[0])
  const [quoteLoading, setQuoteLoading] = useState(false)

  const [fact, setFact] = useState<FactData | null>(null)
  const [factLoading, setFactLoading] = useState(false)

  const [topic, setTopic] = useState<NewsTopic>('world')
  const [news, setNews] = useState<NewsItem[]>([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [newsError, setNewsError] = useState<string | null>(null)

  const weatherStatus = useMemo(() => {
    if (!weather) return '--'
    return weatherCodeLabel(weather.weatherCode)
  }, [weather])

  const fetchWeather = useCallback(async (cityName: string) => {
    setWeatherLoading(true)
    setWeatherError(null)
    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      )
      const geoJson = await geoResponse.json()
      const place = geoJson?.results?.[0]
      if (!place) {
        throw new Error('Location not found')
      }

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure,is_day&daily=sunrise,sunset&timezone=auto`
      )
      const weatherJson = await weatherResponse.json()

      setWeather({
        city: place.name,
        country: place.country,
        temperature: weatherJson.current.temperature_2m,
        feelsLike: weatherJson.current.apparent_temperature,
        humidity: weatherJson.current.relative_humidity_2m,
        wind: weatherJson.current.wind_speed_10m,
        pressure: weatherJson.current.surface_pressure,
        precipitation: weatherJson.current.precipitation,
        weatherCode: weatherJson.current.weather_code,
        isDay: weatherJson.current.is_day,
        sunrise: weatherJson.daily?.sunrise?.[0],
        sunset: weatherJson.daily?.sunset?.[0],
      })

      setWeatherCity(place.name)
      setWeatherInput(place.name)
    } catch {
      setWeatherError('Unable to load weather right now.')
    } finally {
      setWeatherLoading(false)
    }
  }, [])

  const fetchQuote = useCallback(async () => {
    setQuoteLoading(true)
    try {
      const response = await fetch('https://zenquotes.io/api/random')
      const json = await response.json()
      const entry = json?.[0]
      if (!entry?.q || !entry?.a) throw new Error('No quote')
      setQuote({ text: entry.q, author: entry.a })
    } catch {
      const fallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
      setQuote(fallback)
    } finally {
      setQuoteLoading(false)
    }
  }, [])

  const fetchFunFact = useCallback(async () => {
    setFactLoading(true)
    try {
      let selected: FactData | null = null

      for (let i = 0; i < 4; i += 1) {
        const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
        const data = await response.json()
        if (data?.extract && data?.thumbnail?.source) {
          selected = {
            title: data.title,
            text: data.extract,
            image: data.thumbnail.source,
            link: data?.content_urls?.desktop?.page,
          }
          break
        }
      }

      if (!selected) {
        selected = {
          title: 'Honey Bees',
          text: 'Honey bees communicate through a waggle dance to tell hive mates where food is.',
          image: '/placeholder.jpg',
        }
      }

      setFact(selected)
    } catch {
      setFact({
        title: 'Honey Bees',
        text: 'Honey bees communicate through a waggle dance to tell hive mates where food is.',
        image: '/placeholder.jpg',
      })
    } finally {
      setFactLoading(false)
    }
  }, [])

  const fetchNews = useCallback(async (currentTopic: NewsTopic) => {
    setNewsLoading(true)
    setNewsError(null)
    try {
      const response = await fetch(
        `https://content.guardianapis.com/search?api-key=test&section=${currentTopic}&page-size=10&order-by=newest&show-fields=thumbnail,trailText`
      )
      const json = await response.json()
      const results = json?.response?.results || []

      const parsed: NewsItem[] = results.slice(0, 10).map((item: any) => ({
        id: item.id,
        title: item.webTitle,
        url: item.webUrl,
        summary: cleanText(item.fields?.trailText || 'Open article for full details.'),
        image: item.fields?.thumbnail,
        published: item.webPublicationDate,
      }))

      setNews(parsed)
    } catch {
      setNews([])
      setNewsError('Unable to load latest news at the moment.')
    } finally {
      setNewsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWeather('Dharan')
    fetchQuote()
    fetchFunFact()
  }, [fetchWeather, fetchQuote, fetchFunFact])

  useEffect(() => {
    fetchNews(topic)
  }, [topic, fetchNews])

  return (
    <section id="productivity" className="py-24 relative prod-stage">
      <div className="prod-orb prod-orb-a" aria-hidden="true" />
      <div className="prod-orb prod-orb-b" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="reveal space-y-3">
          <p className="font-mono text-accent text-xs tracking-[0.22em]">04. PRODUCTIVITY HUB</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            Live Dashboard
          </h2>
          <p className="text-muted-foreground max-w-3xl">
            One place for weather, inspiration, learning facts, and topic-based global headlines.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 prod-grid">
          <div className="prod-card reveal p-6 rounded-2xl border border-border bg-card/75 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">Weather Viewer</h3>
              </div>
              <button
                onClick={() => fetchWeather(weatherCity)}
                className="prod-refresh-btn p-2 rounded-lg border border-border hover:border-accent/50 transition-colors"
                aria-label="Refresh weather"
              >
                <RefreshCcw className={`w-4 h-4 ${weatherLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="flex gap-2">
              <input
                value={weatherInput}
                onChange={(event) => setWeatherInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && weatherInput.trim()) {
                    fetchWeather(weatherInput.trim())
                  }
                }}
                placeholder="Search city"
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                onClick={() => weatherInput.trim() && fetchWeather(weatherInput.trim())}
                className="px-4 rounded-xl bg-accent text-accent-foreground text-sm font-medium inline-flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>

            {weatherError && <p className="text-sm text-red-500">{weatherError}</p>}

            {!weather && weatherLoading && (
              <div className="h-28 rounded-xl border border-border bg-background/40 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              </div>
            )}

            {weather && (
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {weather.city}, {weather.country}
                    </p>
                    <div className="flex items-end gap-3">
                      <p className="metric-pop text-5xl font-semibold">{Math.round(weather.temperature)} deg</p>
                      <p className="text-sm text-muted-foreground mb-1">{weatherStatus}</p>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">
                    {weather.isDay ? 'Daytime' : 'Night'}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="prod-mini">
                    <Thermometer className="w-4 h-4 text-accent" />
                    <p>Feels like {Math.round(weather.feelsLike)} deg</p>
                  </div>
                  <div className="prod-mini">
                    <Droplets className="w-4 h-4 text-accent" />
                    <p>Humidity {weather.humidity}%</p>
                  </div>
                  <div className="prod-mini">
                    <Wind className="w-4 h-4 text-accent" />
                    <p>Wind {Math.round(weather.wind)} km/h</p>
                  </div>
                  <div className="prod-mini">
                    <Gauge className="w-4 h-4 text-accent" />
                    <p>{Math.round(weather.pressure)} hPa</p>
                  </div>
                  <div className="prod-mini">
                    <CloudSun className="w-4 h-4 text-accent" />
                    <p>Precip {weather.precipitation} mm</p>
                  </div>
                  <div className="prod-mini">
                    <Sunrise className="w-4 h-4 text-accent" />
                    <p>{formatTime(weather.sunrise)} / {formatTime(weather.sunset)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="prod-card reveal p-6 rounded-2xl border border-border bg-card/75 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">Random Quote</h3>
              </div>
              <button
                onClick={fetchQuote}
                className="prod-refresh-btn p-2 rounded-lg border border-border hover:border-accent/50 transition-colors"
                aria-label="New quote"
              >
                <RefreshCcw className={`w-4 h-4 ${quoteLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="quote-live rounded-xl border border-border bg-background/40 p-5 min-h-[210px] flex flex-col justify-between">
              <p className="text-lg leading-relaxed text-foreground">
                "{quote.text}"
              </p>
              <p className="text-sm font-medium text-accent mt-4">- {quote.author}</p>
            </div>
          </div>

          <div className="prod-card reveal p-6 rounded-2xl border border-border bg-card/75 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">Random Fun Fact</h3>
              </div>
              <button
                onClick={fetchFunFact}
                className="prod-refresh-btn p-2 rounded-lg border border-border hover:border-accent/50 transition-colors"
                aria-label="New fact"
              >
                <RefreshCcw className={`w-4 h-4 ${factLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {!fact && (
              <div className="h-40 rounded-xl border border-border bg-background/40 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              </div>
            )}

            {fact && (
              <div className="grid md:grid-cols-5 gap-4 items-start">
                <div className="fact-image-wrap md:col-span-2 rounded-xl overflow-hidden border border-border">
                  <img src={fact.image} alt={fact.title} className="w-full h-48 md:h-56 object-cover" />
                </div>
                <div className="md:col-span-3 space-y-3">
                  <p className="text-xl font-semibold text-foreground">{fact.title}</p>
                  <p className="text-muted-foreground leading-relaxed">{fact.text}</p>
                  {fact.link && (
                    <a
                      href={fact.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
                    >
                      <Sparkles className="w-4 h-4" />
                      Read source
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="prod-card reveal p-6 rounded-2xl border border-border bg-card/75 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">Latest News</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                {topicOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTopic(option.value)}
                    className={`topic-chip px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      topic === option.value
                        ? 'bg-accent text-accent-foreground border-accent'
                        : 'bg-background border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {newsLoading && (
              <div className="h-24 rounded-xl border border-border bg-background/40 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              </div>
            )}

            {newsError && <p className="text-sm text-red-500">{newsError}</p>}

            {!newsLoading && !newsError && (
              <div className="grid md:grid-cols-2 gap-3">
                {news.slice(0, 10).map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="news-item group border border-border rounded-xl p-3 bg-background/40 hover:border-accent/40 transition-all"
                  >
                    <div className="flex gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg border border-border bg-card flex items-center justify-center">
                          <Newspaper className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-snug text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                        <p className="text-[11px] text-muted-foreground mt-2">
                          {new Date(item.published).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

