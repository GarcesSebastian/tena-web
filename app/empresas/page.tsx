"use client"

import { useState } from "react"
import Link from "next/link"
import { Construction } from "lucide-react"

export default function Empresas() {
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
        <div className="animate-pulse mb-6">
          <Construction className="w-24 h-24 text-amber-400 mx-auto" />
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">Sección en Desarrollo</h1>

        <div className="w-24 h-1 bg-amber-400 rounded-full my-6"></div>

        <p className="text-white text-xl md:text-2xl max-w-[80%] drop-shadow-sm">
          Estamos trabajando en esta sección para ofrecerte la mejor experiencia posible. Pronto podrás conocer todas
          nuestras empresas y los servicios que ofrecen.
        </p>

        <div className="mt-12 w-full max-w-md bg-gray-900/60 backdrop-blur-sm p-8 rounded-xl">
          <p className="text-gray-300 mb-6">¿Tienes alguna pregunta sobre nuestras empresas mientras tanto?</p>
          <Link
            href="/contacto"
            className="bg-white text-gray-800 font-bold px-8 py-4 rounded-full shadow-md hover:bg-amber-400 hover:text-white transition-colors duration-300 inline-block"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  )
}

