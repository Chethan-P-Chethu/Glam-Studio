import React, { useEffect, useMemo, useState } from 'react'
import { API_BASE } from '../config'

const CATALOG = {
  Men: [
    {
      name: 'GOAT Saloon',
      services: [
        { name: 'Haircut + Beard', price: 480 },
        { name: 'Haircut + Colouring', price: 600 },
        { name: 'Haircut + Facial', price: 800 },
      ],
      providers: ['John', 'David', 'Paul'],
    },
    {
      name: 'Sunshine Saloon',
      services: [
        { name: 'Haircut', price: 300 },
        { name: 'Haircut + Styling', price: 500 },
        { name: 'Hair Spa', price: 700 },
      ],
      providers: ['Mike', 'Steve', 'Rob'],
    },
    {
      name: 'Hairspot Saloon',
      services: [
        { name: 'Haircut', price: 350 },
        { name: 'Beard Trim', price: 200 },
        { name: 'Hair Colour', price: 550 },
      ],
      providers: ['Alex', 'Sam', 'Chris'],
    },
  ],
  Women: [
    {
      name: 'Aishwarya Parlour',
      services: [
        { name: 'Haircut + Styling', price: 500 },
        { name: 'Hair Spa', price: 800 },
        { name: 'Bridal Makeup', price: 2000 },
      ],
      providers: ['Priya', 'Anjali', 'Kavya'],
    },
    {
      name: 'Queen Parlour',
      services: [
        { name: 'Hair Colour', price: 900 },
        { name: 'Facial', price: 1200 },
        { name: 'Manicure + Pedicure', price: 1500 },
      ],
      providers: ['Sneha', 'Divya', 'Pooja'],
    },
    {
      name: 'Trends Parlour',
      services: [
        { name: 'Haircut', price: 400 },
        { name: 'Saree Draping', price: 600 },
        { name: 'Party Makeup', price: 1800 },
      ],
      providers: ['Meera', 'Shreya', 'Aditi'],
    },
  ],
}

const currency = (n) => '₹' + (n || 0).toFixed(2)

export default function Booking() {
  const [type, setType] = useState('Men')
  const [parlourIdx, setParlourIdx] = useState(0)
  const [serviceIdx, setServiceIdx] = useState(0)
  const [provider, setProvider] = useState('')
  const [name, setName] = useState('')
  const [payment, setPayment] = useState('UPI')
  const [toast, setToast] = useState(null)

  const parlour = useMemo(() => CATALOG[type][parlourIdx], [type, parlourIdx])

  useEffect(() => {
    setServiceIdx(0)
    setProvider(CATALOG[type][parlourIdx].providers[0])
  }, [type, parlourIdx])

  const price = parlour.services[serviceIdx].price
  const gst = payment === 'UPI' ? price * 0.18 : 0
  const discount = payment === 'UPI' ? price * 0.1 : 0
  const finalPrice = payment === 'UPI' ? price + gst - discount : price

  async function submit() {
    const trimmed = (name || '').trim()
    if (!/^[A-Za-z ]{2,}$/.test(trimmed)) {
      setToast({ t: 'error', m: 'Please enter a valid name (letters and spaces, min 2 chars).' })
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: trimmed,
          type,
          parlourName: parlour.name,
          serviceName: parlour.services[serviceIdx].name,
          provider: provider || parlour.providers[0],
          paymentMethod: payment,
          price,
          finalPrice,
        }),
      })
      if (!res.ok) throw new Error('Failed to create booking')
      setToast({ t: 'success', m: 'Booking confirmed! We look forward to serve you 😊' })
      setName('')
    } catch (e) {
      setToast({ t: 'error', m: e.message })
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-semibold mb-6 text-fuchsia-700">Book a Service</h2>
        {toast && (
          <div className={`${toast.t === 'error' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'} px-4 py-2 rounded mb-4`}>{toast.m}</div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Parlour Type</label>
            <select className="w-full border rounded px-3 py-2" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Men">Men Parlour</option>
              <option value="Women">Women Parlour</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parlour</label>
            <select className="w-full border rounded px-3 py-2" value={parlourIdx} onChange={(e) => setParlourIdx(Number(e.target.value))}>
              {CATALOG[type].map((p, i) => (
                <option key={p.name} value={i}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Service</label>
            <select className="w-full border rounded px-3 py-2" value={serviceIdx} onChange={(e) => setServiceIdx(Number(e.target.value))}>
              {parlour.services.map((s, i) => (
                <option key={s.name} value={i}>{`${s.name} ( ${currency(s.price)} )`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Provider</label>
            <select className="w-full border rounded px-3 py-2" value={provider} onChange={(e) => setProvider(e.target.value)}>
              {parlour.providers.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select className="w-full border rounded px-3 py-2" value={payment} onChange={(e) => setPayment(e.target.value)}>
              {['UPI', 'Cash', 'CreditCard'].map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 bg-gray-50 rounded-lg p-4 border">
          <div className="flex flex-wrap gap-4 items-center text-sm">
            <span className="font-medium">Price:</span> {currency(price)}
            {payment === 'UPI' && <span>| GST: {currency(gst)}</span>}
            {payment === 'UPI' && <span>| Discount: {currency(discount)}</span>}
            <span className="font-semibold text-fuchsia-700">| Final: {currency(finalPrice)}</span>
          </div>
        </div>
        <button onClick={submit} className="mt-6 w-full md:w-auto bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-700 hover:to-rose-700 text-white px-8 py-3 rounded-xl shadow transition-transform active:scale-95">
          Confirm Booking
        </button>
      </div>
    </main>
  )
}
