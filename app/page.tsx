"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const [navOpen, setNavOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const options = [
    { label: "Inicio", href: "/" },
    { label: "Empresas", href: "/empresas" },
    { label: "Servicios", href: "/servicios" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
    { label: "Mensajes", href: "/mensajes" },
  ]

  // Datos de prueba para la galería
  const galeriaItems = [
    {
      id: 1,
      titulo: "Innovación Tecnológica",
      descripcion: "Soluciones de vanguardia para empresas modernas",
      imagen: "/placeholder.svg?height=600&width=1200",
    },
    {
      id: 2,
      titulo: "Desarrollo Web",
      descripcion: "Sitios web responsivos y optimizados para buscadores",
      imagen: "/placeholder.svg?height=600&width=1200",
    },
    {
      id: 3,
      titulo: "Consultoría Estratégica",
      descripcion: "Asesoramiento experto para el crecimiento de tu negocio",
      imagen: "/placeholder.svg?height=600&width=1200",
    },
  ]

  const handleOptionClick = () => {
    setNavOpen(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === galeriaItems.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? galeriaItems.length - 1 : prev - 1))
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
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

      {/* Galería de fondo */}
      <div className="absolute inset-0 z-0">
        {galeriaItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <Image
              src={item.imagen || "/placeholder.svg"}
              alt={item.titulo}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Controles de la galería */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {galeriaItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-amber-400 w-6" : "bg-white/50"
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Flechas de navegación */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
          aria-label="Anterior"
        >
          &#10094;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
          aria-label="Siguiente"
        >
          &#10095;
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col gap-y-5 justify-center items-center relative z-10 h-full px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          {galeriaItems[currentSlide].titulo}
        </h1>
        <p className="text-white text-xl md:text-2xl max-w-[80%] drop-shadow-sm">
          {galeriaItems[currentSlide].descripcion}
        </p>
        <button className="bg-white text-gray-800 font-bold px-6 py-3 rounded-full shadow-md hover:bg-amber-400 hover:text-white transition-colors duration-300 mt-6">
          Leer más...
        </button>
      </div>
    </div>
  )
}

