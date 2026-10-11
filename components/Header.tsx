import type { CSSProperties } from 'react';

export function Header() {
  const nav = ['Collections', 'Studio', 'Drops', 'Journal'];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-midnight/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-lg font-black text-slate-900">
            N
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-accent">Nova</div>
            <div className="text-xs text-slate-400">atelier</div>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          {nav.map((item) => (
            <a key={item} href="#" className="transition hover:text-white">
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-white md:inline-flex">
            Search
          </button>
          <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
            Cart (2)
          </button>
        </div>
      </div>
    </header>
  );
}
