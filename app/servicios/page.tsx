"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X } from "lucide-react"

export default function Servicios() {
  const [navOpen, setNavOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const options = [
    { label: "Inicio", href: "/" },
    { label: "Empresas", href: "/empresas" },
    { label: "Servicios", href: "/servicios" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
    { label: "Mensajes", href: "/mensajes" },
  ]

  // Datos de la galería
  const galeriaItems = [
    {
      id: 1,
      titulo: "Desarrollo Web",
      descripcion: "Creamos sitios web modernos, responsivos y optimizados para buscadores",
      imagen: "/placeholder.svg?height=600&width=800",
      categoria: "Desarrollo",
    },
    {
      id: 2,
      titulo: "Aplicaciones Móviles",
      descripcion: "Soluciones nativas e híbridas para iOS y Android",
      imagen: "/placeholder.svg?height=600&width=800",
      categoria: "Desarrollo",
    },
    {
      id: 3,
      titulo: "Consultoría IT",
      descripcion: "Asesoramiento estratégico para optimizar tu infraestructura tecnológica",
      imagen: "/placeholder.svg?height=600&width=800",
      categoria: "Consultoría",
    },
    {
      id: 4,
      titulo: "Ciberseguridad",
      descripcion: "Protección avanzada contra amenazas digitales",
      imagen: "/placeholder.svg?height=600&width=800",
      categoria: "Seguridad",
    },
    {
      id: 5,
      titulo: "Cloud Computing",
      descripcion: "Soluciones en la nube escalables y seguras",
      imagen: "/placeholder.svg?height=600&width=800",
      categoria: "Infraestructura",
    },
    {
      id: 6,
      titulo: "Inteligencia Artificial",
      descripcion: "Implementación de IA para optimizar procesos empresariales",
      imagen: "/placeholder.svg?height=600&width=800",
      categoria: "Innovación",
    },
    {
      id: 7,
      titulo: "Análisis de Datos",
      descripcion: "Transformamos tus datos en insights accionables",
      imagen: "/placeholder.svg?height=600&width=800",
      categoria: "Análisis",
    },
    {
      id: 8,
      titulo: "Marketing Digital",
      descripcion: "Estrategias para aumentar tu visibilidad online",
      imagen: "/placeholder.svg?height=600&width=800",
      categoria: "Marketing",
    },
    {
      id: 9,
      titulo: "Soporte Técnico",
      descripcion: "Asistencia técnica 24/7 para tu negocio",
      imagen: "/placeholder.svg?height=600&width=800",
      categoria: "Soporte",
    },
  ]

  const categorias = [
    "Todas",
    "Desarrollo",
    "Consultoría",
    "Seguridad",
    "Infraestructura",
    "Innovación",
    "Análisis",
    "Marketing",
    "Soporte",
  ]
  const [categoriaActiva, setCategoriaActiva] = useState("Todas")

  const galeriaFiltrada =
    categoriaActiva === "Todas" ? galeriaItems : galeriaItems.filter((item) => item.categoria === categoriaActiva)

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

      {/* Contenido principal - Galería */}
      <div className="flex flex-col gap-y-8 justify-center items-center relative z-10 min-h-screen px-4 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg text-center">
          Nuestros Servicios
        </h1>
        <p className="text-white text-xl md:text-2xl max-w-[80%] text-center drop-shadow-sm mb-4">
          Soluciones tecnológicas integrales adaptadas a las necesidades específicas de tu negocio
        </p>

        {/* Filtro de categorías */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaActiva(categoria)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                categoriaActiva === categoria
                  ? "bg-amber-400 text-gray-900"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        {/* Galería de servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {galeriaFiltrada.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer hover:transform hover:scale-[1.02] transition-all duration-300"
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative h-64 w-full">
                <Image src={item.imagen || "/placeholder.svg"} alt={item.titulo} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-amber-400 transition-colors duration-300">
                    {item.titulo}
                  </h3>
                  <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.descripcion}
                  </p>
                </div>
                <div className="absolute top-3 right-3 bg-amber-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                  {item.categoria}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 w-full max-w-4xl bg-gray-900/60 backdrop-blur-sm p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Necesitas un servicio personalizado?</h2>
          <p className="text-gray-300 mb-6">
            Contáctanos para discutir cómo podemos adaptar nuestros servicios a tus necesidades específicas.
          </p>
          <button className="bg-white text-gray-800 font-bold px-8 py-4 rounded-full shadow-md hover:bg-amber-400 hover:text-white transition-colors duration-300 text-lg">
            Solicitar información
          </button>
        </div>
      </div>

      {/* Modal para ver servicio ampliado */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-gray-900 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-amber-400 hover:text-gray-900 transition-colors duration-300"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative h-[50vh] w-full">
              <Image
                src={galeriaFiltrada[selectedImage].imagen || "/placeholder.svg"}
                alt={galeriaFiltrada[selectedImage].titulo}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-6 bg-gray-900">
              <h2 className="text-2xl font-bold text-white mb-2">{galeriaFiltrada[selectedImage].titulo}</h2>
              <p className="text-gray-300 mb-4">{galeriaFiltrada[selectedImage].descripcion}</p>
              <div className="mb-4 inline-block bg-amber-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                {galeriaFiltrada[selectedImage].categoria}
              </div>
              <button className="w-full mt-4 bg-white text-gray-800 font-bold px-6 py-3 rounded-full shadow-md hover:bg-amber-400 hover:text-white transition-colors duration-300">
                Solicitar este servicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

