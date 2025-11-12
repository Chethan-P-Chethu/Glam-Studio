import React, { useState } from 'react'
import { API_BASE } from '../config'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    const emailOk = /.+@.+\..+/.test(email)
    if (!name || !emailOk || !message) {
      setToast({ t: 'error', m: 'Please fill all fields.' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Failed to submit feedback')
      }
      setToast({ t: 'success', m: 'Thanks for your feedback! We will get back to you.' })
      setName(''); setEmail(''); setMessage('')
    } catch (e) {
      setToast({ t: 'error', m: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-semibold mb-6 text-fuchsia-700">Contact Us</h2>
        <p className="text-gray-700 mb-6">Have a question or feedback? Send us a message and we’ll respond soon.</p>
        {toast && (
          <div className={`${toast.t === 'error' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'} px-4 py-2 rounded mb-4`}>{toast.m}</div>
        )}
        <form onSubmit={submit} className="grid gap-4">
          <input className="border rounded px-3 py-2" placeholder="Your Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Your Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <textarea className="border rounded px-3 py-2 min-h-[120px]" placeholder="Message" value={message} onChange={(e)=>setMessage(e.target.value)} />
          <button disabled={loading} className="bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-700 hover:to-rose-700 disabled:opacity-60 text-white px-8 py-3 rounded-xl w-fit shadow transition-transform active:scale-95">{loading ? 'Sending...' : 'Send Message'}</button>
        </form>
      </div>
    </main>
  )
}
