import React, { useEffect, useState } from 'react'
import Home from './pages/Home.jsx'
import Booking from './pages/Booking.jsx'
import Contact from './pages/Contact.jsx'
import Admin from './pages/Admin.jsx'
import Navbar from './components/Navbar.jsx'

// API base is now defined in src/config.js and imported where needed

export default function App() {
  const [route, setRoute] = useState('home')
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'))

  useEffect(() => {
    const onHashChange = () => {
      const r = window.location.hash.replace('#', '') || 'home'
      setRoute(r)
    }
    onHashChange()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function onLogin() {
    setAuthed(true)
    window.location.hash = 'admin'
  }

  function onLogout() {
    localStorage.removeItem('token')
    setAuthed(false)
    window.location.hash = 'home'
  }

  return (
    <div>
      <Navbar route={route} setRoute={(r)=> (window.location.hash = r)} authed={authed} onLogout={onLogout} />
      {route === 'home' && <Home />}
      {route === 'booking' && <Booking />}
      {route === 'contact' && <Contact />}
      {route === 'admin' && <Admin authed={authed} onLogin={onLogin} />}
    </div>
  )
}
