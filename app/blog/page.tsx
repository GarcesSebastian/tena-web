"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, AlertCircle } from "lucide-react"

export default function Blog() {
  const [navOpen, setNavOpen] = useState(false)

  const options = [
    { label: "Inicio", href: "/" },
    { label: "Empresas", href: "/empresas" },
    { label: "Servicios", href: "/servicios" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
    { label: "Mensajes", href: "/mensajes" },
  ]

  const handleOptionClick = () => {
    setNavOpen(false)
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
      <button
        onClick={() => setNavOpen(!navOpen)}
        className="absolute top-4 left-4 z-50 p-2 focus:outline-none cursor-pointer rounded-md hover:bg-gray-600 transition-colors duration-300"
      >
        <div className="w-8 h-8 relative">
          <span
            className={`block absolute h-0.5 w-full bg-white transform transition duration-300 ease-in-out ${
              navOpen ? "rotate-45 top-3" : "top-1"
            }`}
          ></span>
          <span
            className={`block absolute h-0.5 w-full bg-white transform transition duration-300 ease-in-out ${
              navOpen ? "opacity-0" : "top-3"
            }`}
          ></span>
          <span
            className={`block absolute h-0.5 w-full bg-white transform transition duration-300 ease-in-out ${
              navOpen ? "-rotate-45 top-3" : "top-5"
            }`}
          ></span>
        </div>
      </button>

      {/* Menú overlay */}
      <div
        className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-700 ${
          navOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Fondo negro en expansión */}
        <div
          className={`absolute bg-black rounded-full transition-all duration-700 ${
            navOpen ? "w-[2000px] h-[2000px]" : "w-0 h-0"
          }`}
        ></div>
        {/* Opciones del menú */}
        <nav
          className={`relative z-50 flex flex-col gap-6 text-center transition-opacity duration-700 ${
            navOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {options.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-white text-2xl block hover:text-amber-400 hover:scale-105 transform transition-all duration-300 ease-in-out"
              onClick={handleOptionClick}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Contenido principal - En desarrollo */}
      <div className="flex flex-col gap-y-8 justify-center items-center relative z-10 min-h-screen px-4 py-20 text-center">
        <div className="relative">
          <Clock className="w-24 h-24 text-amber-400 mx-auto animate-pulse" />
          <AlertCircle className="w-10 h-10 text-amber-400 absolute top-0 right-0 animate-bounce" />
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">Blog en Construcción</h1>

        <div className="w-24 h-1 bg-amber-400 rounded-full my-6"></div>

        <p className="text-white text-xl md:text-2xl max-w-[80%] drop-shadow-sm">
          Nuestro equipo está trabajando en crear contenido valioso para ti. Muy pronto podrás disfrutar de artículos
          sobre tecnología, innovación y tendencias digitales.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-white text-gray-800 font-bold px-8 py-4 rounded-full shadow-md hover:bg-amber-400 hover:text-white transition-colors duration-300"
          >
            Volver al inicio
          </Link>
          <Link
            href="/servicios"
            className="bg-transparent border border-white text-white font-bold px-8 py-4 rounded-full shadow-md hover:bg-white/10 transition-colors duration-300"
          >
            Ver servicios
          </Link>
        </div>

        <div className="mt-12 w-full max-w-md">
          <p className="text-amber-400 text-lg">
            ¡Suscríbete para recibir una notificación cuando el blog esté disponible!
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-grow px-4 py-3 rounded-l-full rounded-r-full sm:rounded-r-none bg-gray-800 text-white border border-gray-700 focus:border-amber-400 focus:outline-none"
            />
            <button className="px-6 py-3 rounded-l-full rounded-r-full sm:rounded-l-none bg-amber-400 text-gray-900 font-bold hover:bg-amber-500 transition-colors duration-300">
              Suscribirse
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

