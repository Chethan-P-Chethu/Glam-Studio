import React, { useState } from 'react'

export default function Home() {
  const [imgLoaded, setImgLoaded] = useState(false)
  return (
    <main className="body-bg">
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-fuchsia-800 animate-[fadein_500ms_ease]">
            Elevate Your Style at GlamStudio
          </h2>
          <p className="mt-4 text-gray-700 text-lg animate-[fadein_700ms_ease]">
            Premium grooming and beauty services for Men and Women. From classic haircuts to bridal artistry, our expert professionals craft looks that make you feel confident and radiant.
          </p>
          <div className="mt-6 flex gap-3 animate-[fadein_800ms_ease]">
            <a href="#booking" className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white shadow hover:from-fuchsia-700 hover:to-rose-700 transition-transform active:scale-95">Book a Service</a>
            <a href="#contact" className="px-6 py-3 rounded-xl bg-white text-fuchsia-700 border border-fuchsia-200 hover:bg-white/80 transition-transform active:scale-95">Contact Us</a>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-700 animate-[fadein_900ms_ease]">
            <li className="bg-white/70 rounded-lg p-3 border">Certified Stylists</li>
            <li className="bg-white/70 rounded-lg p-3 border">Premium Products</li>
            <li className="bg-white/70 rounded-lg p-3 border">Hygienic & Comfortable</li>
            <li className="bg-white/70 rounded-lg p-3 border">Personalized Care</li>
          </ul>
        </div>
        <div className="relative">
          <div className="rounded-3xl bg-white/70 border backdrop-blur shadow-2xl p-6 md:p-8 animate-[fadein_600ms_ease]">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 bg-gradient-to-br from-fuchsia-50 to-rose-50 border rounded-2xl p-4">
                <div className="text-3xl font-extrabold text-fuchsia-700">1.2k+</div>
                <div className="text-sm text-gray-600">Bookings Served</div>
              </div>
              <div className="col-span-1 bg-gradient-to-br from-indigo-50 to-fuchsia-50 border rounded-2xl p-4">
                <div className="text-3xl font-extrabold text-indigo-700">25+</div>
                <div className="text-sm text-gray-600">Expert Stylists</div>
              </div>
              <div className="col-span-1 bg-gradient-to-br from-emerald-50 to-teal-50 border rounded-2xl p-4">
                <div className="text-3xl font-extrabold text-emerald-700">4.9</div>
                <div className="text-sm text-gray-600">Avg. Rating</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group border rounded-2xl p-4 bg-white hover:bg-fuchsia-50 transition">
                <div className="text-lg font-semibold text-gray-900">Men's Grooming</div>
                <div className="text-sm text-gray-600 mt-1">Haircut, Beard Styling, Colour, Spa</div>
                <div className="mt-3 text-fuchsia-700 text-sm group-hover:translate-x-1 transition">Explore →</div>
              </div>
              <div className="group border rounded-2xl p-4 bg-white hover:bg-rose-50 transition">
                <div className="text-lg font-semibold text-gray-900">Women’s Beauty</div>
                <div className="text-sm text-gray-600 mt-1">Hair Styling, Facial, Bridal Makeup</div>
                <div className="mt-3 text-rose-700 text-sm group-hover:translate-x-1 transition">Explore →</div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500 blur-2xl opacity-70" />
          <div className="pointer-events-none absolute -top-6 -right-6 w-28 h-28 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 blur-2xl opacity-70" />
        </div>
      </section>
    </main>
  )
}
