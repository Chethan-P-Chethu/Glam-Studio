import React, { useState } from 'react'

export default function Navbar({ route, setRoute, authed, onLogout }) {
  const [open, setOpen] = useState(false)
  const navItem = (id, label) => (
    <button
      onClick={() => { setRoute(id); setOpen(false) }}
      className={`px-4 py-2 rounded-lg transition ${route === id ? 'bg-fuchsia-600 text-white shadow' : 'hover:bg-white/70'}`}
    >
      {label}
    </button>
  )

  return (
    <header className="backdrop-blur bg-white/60 sticky top-0 z-10 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500" />
          <h1 className="text-xl md:text-2xl font-semibold text-fuchsia-700">GlamStudio</h1>
        </div>
        <button
          className="md:hidden rounded-lg p-2 bg-white/70 border hover:bg-white"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.75 5.25h16.5v1.5H3.75zM3.75 11.25h16.5v1.5H3.75zM3.75 17.25h16.5v1.5H3.75z"/></svg>
        </button>
        <nav className="hidden md:flex items-center gap-2">
          {navItem('home','Home')}
          {navItem('booking','Book Service')}
          {navItem('contact','Contact')}
          {navItem('admin','Admin')}
          {authed && (
            <button onClick={onLogout} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Logout</button>
          )}
        </nav>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            {navItem('home','Home')}
            {navItem('booking','Book Service')}
            {navItem('contact','Contact')}
            {navItem('admin','Admin')}
            {authed && (
              <button onClick={() => { onLogout(); setOpen(false) }} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-left">Logout</button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
