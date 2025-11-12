import React, { useEffect, useMemo, useState } from 'react'
import { API_BASE } from '../config'

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function submit() {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      localStorage.setItem('token', data.token)
      onLogin()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl font-semibold mb-6 text-fuchsia-700">Admin Login</h2>
      {error && <div className="bg-rose-100 text-rose-700 px-4 py-2 rounded mb-4">{error}</div>}
      <div className="grid gap-4">
        <input className="border rounded px-3 py-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" className="border rounded px-3 py-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={submit} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-2 rounded-lg shadow">Login</button>
      </div>
    </div>
  )
}

function Dashboard() {
  const [q, setQ] = useState('')
  const [allBookings, setAllBookings] = useState([])
  const [allFeedback, setAllFeedback] = useState([])
  const [pendingDelete, setPendingDelete] = useState(null) // { id, name }
  const bookings = useMemo(() => {
    if (!q) return allBookings
    const s = q.toLowerCase()
    return allBookings.filter(b =>
      (b.customerName||'').toLowerCase().includes(s) ||
      (b.parlourName||'').toLowerCase().includes(s) ||
      (b.serviceName||'').toLowerCase().includes(s) ||
      (b.provider||'').toLowerCase().includes(s)
    )
  }, [q, allBookings])
  const feedback = useMemo(() => {
    if (!q) return allFeedback
    const s = q.toLowerCase()
    return allFeedback.filter(f =>
      (f.name||'').toLowerCase().includes(s) ||
      (f.email||'').toLowerCase().includes(s) ||
      (f.message||'').toLowerCase().includes(s)
    )
  }, [q, allFeedback])
  const [tab, setTab] = useState('bookings')
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const [br, fr] = await Promise.all([
        fetch(`${API_BASE}/api/bookings?q=${encodeURIComponent(q)}`, { headers }),
        fetch(`${API_BASE}/api/feedback?q=${encodeURIComponent(q)}`, { headers })
      ])
      if (br.status === 401 || fr.status === 401) throw new Error('Unauthorized. Please login again.')
      const brText = await br.text()
      const frText = await fr.text()
      try {
        const brJson = JSON.parse(brText)
        const frJson = JSON.parse(frText)
        setAllBookings(brJson)
        setAllFeedback(frJson)
      } catch (e) {
        alert('Error parsing JSON: ' + e.message)
      }
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteBooking(id) {
    const prev = allBookings
    try {
      // optimistic update
      setAllBookings(prev.filter(b => b._id !== id))
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Delete failed')
    } catch (e) {
      alert(e.message)
      setAllBookings(prev) // revert on failure
    }
  }

  function requestDelete(id, name) {
    setPendingDelete({ id, name })
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    const { id } = pendingDelete
    setPendingDelete(null)
    await deleteBooking(id)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      load()
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  async function exportExcel() {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/bookings/export?q=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bookings.xlsx'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert(e.message)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 md:p-8 animate-[fadein_400ms_ease]"><style>{`@keyframes fadein{from{opacity:.0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <h2 className="text-2xl font-semibold text-fuchsia-700 flex-1">Admin Dashboard</h2>
        <div className="flex gap-2">
          <button onClick={() => setTab('bookings')} className={`px-4 py-2 rounded-lg shadow-sm ${tab==='bookings'?'bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white':'bg-white hover:bg-gray-50'}`}>Bookings</button>
          <button onClick={() => setTab('feedback')} className={`px-4 py-2 rounded-lg shadow-sm ${tab==='feedback'?'bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white':'bg-white hover:bg-gray-50'}`}>Feedback</button>
        </div>
        <input className="border rounded px-3 py-2" placeholder="Search..." value={q} onChange={(e)=>setQ(e.target.value)} />
        <button onClick={load} className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg">{loading ? 'Loading...' : 'Refresh'}</button>
        {tab==='bookings' && <button onClick={exportExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow">Export Excel</button>}
      </div>

      {tab==='bookings' && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-fuchsia-100 text-fuchsia-800">
              <tr>
                {['#','Customer','Type','Parlour','Service','Provider','Payment','Price','Final','Created','Actions'].map(h => <th key={h} className="text-left px-3 py-2">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b,i)=> (
                <tr key={b._id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{i+1}</td>
                  <td className="px-3 py-2">{b.customerName}</td>
                  <td className="px-3 py-2">{b.type}</td>
                  <td className="px-3 py-2">{b.parlourName}</td>
                  <td className="px-3 py-2">{b.serviceName}</td>
                  <td className="px-3 py-2">{b.provider}</td>
                  <td className="px-3 py-2">{b.paymentMethod}</td>
                  <td className="px-3 py-2">₹{(b.price||0).toFixed(2)}</td>
                  <td className="px-3 py-2">₹{(b.finalPrice||0).toFixed(2)}</td>
                  <td className="px-3 py-2">{new Date(b.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <button onClick={()=>requestDelete(b._id, b.customerName)} className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs shadow">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='feedback' && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-fuchsia-100 text-fuchsia-800">
              <tr>
                {['#','Name','Email','Message','Created'].map(h => <th key={h} className="text-left px-3 py-2">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {feedback.map((f,i)=> (
                <tr key={f._id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{i+1}</td>
                  <td className="px-3 py-2">{f.name}</td>
                  <td className="px-3 py-2">{f.email}</td>
                  <td className="px-3 py-2 max-w-[500px]">{f.message}</td>
                  <td className="px-3 py-2">{new Date(f.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6 animate-[fadein_200ms_ease]">
            <h3 className="text-lg font-semibold text-gray-900">Delete booking?</h3>
            <p className="text-sm text-gray-600 mt-2">This will permanently remove the booking for <span className="font-medium">{pendingDelete.name}</span>.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={()=>setPendingDelete(null)} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Admin({ authed, onLogin }) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {!authed ? <AdminLogin onLogin={onLogin} /> : <Dashboard />}
    </main>
  )
}
