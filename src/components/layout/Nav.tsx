import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileText, Menu, X } from 'lucide-react'
import { navItems, profile } from '@/data/content'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'

export function Nav() {
  const [condensed, setCondensed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  // Condense past the hero. A real state change, not decoration.
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock scroll while the mobile menu is open. Closing it is handled by the
  // navigation events themselves rather than by reacting to the route change.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      {/* Keyboard users should be able to skip straight to content. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]
                   focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2
                   focus:font-medium focus:text-accent-contrast"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          condensed
            ? 'border-b bg-bg/80 backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className="container-page flex h-16 items-center justify-between gap-4"
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="font-mono text-sm font-medium tracking-tight text-text
                       transition-colors duration-150 hover:text-accent"
          >
            {profile.name.split(' ')[0]}
            <span className="text-accent">.</span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={onHome ? item.href : `/${item.href}`}
                  className="rounded-md px-3 py-2 text-sm text-muted
                             transition-colors duration-150 hover:text-text"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.links.resume}
              className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2
                         text-sm font-medium text-text transition-colors duration-150
                         hover:border-accent/40 hover:bg-accent-soft hover:text-accent sm:inline-flex"
            >
              <FileText size={14} aria-hidden />
              Résumé
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="grid size-10 place-items-center rounded-lg border border-border sm:size-9
                         text-muted transition-colors duration-150 hover:text-text md:hidden"
            >
              {menuOpen ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-16 z-40 bg-bg/95 backdrop-blur-xl md:hidden"
        >
          <ul className="container-page flex flex-col gap-1 py-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={onHome ? item.href : `/${item.href}`}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b py-4 text-lg font-medium text-text"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.links.resume}
                onClick={() => setMenuOpen(false)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-3
                           font-medium text-accent-contrast"
              >
                <FileText size={16} aria-hidden />
                Download résumé
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
