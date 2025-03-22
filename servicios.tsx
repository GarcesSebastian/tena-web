"use client"

import { useState } from "react"
import Link from "next/link"
import { Code, Database, LineChart, Shield, Smartphone, Globe } from "lucide-react"

export default function Servicios() {
  const [navOpen, setNavOpen] = useState(false)
  const [activeService, setActiveService] = useState(0)

  const options = [
    { label: "Inicio", href: "/" },
    { label: "Empresas", href: "/empresas" },
    { label: "Servicios", href: "/servicios" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
  ]

  const servicios = [
    {
      titulo: "Desarrollo Web",
      descripcion: "Creamos sitios web modernos, responsivos y optimizados para buscadores que destacan tu marca.",
      icono: <Code className="w-16 h-16 text-amber-400" />,
      detalles: [
        "Diseño UX/UI personalizado",
        "Desarrollo frontend y backend",
        "Optimización SEO",
        "Integración con CMS",
      ],
    },
    {
      titulo: "Aplicaciones Móviles",
      descripcion:
        "Desarrollamos aplicaciones nativas e híbridas para iOS y Android con experiencias de usuario excepcionales.",
      icono: <Smartphone className="w-16 h-16 text-amber-400" />,
      detalles: [
        "Desarrollo para iOS y Android",
        "Interfaces intuitivas",
        "Integración con APIs",
        "Notificaciones push",
      ],
    },
    {
      titulo: "Análisis de Datos",
      descripcion:
        "Transformamos tus datos en insights accionables para tomar decisiones estratégicas basadas en información.",
      icono: <LineChart className="w-16 h-16 text-amber-400" />,
      detalles: [
        "Dashboards interactivos",
        "Informes personalizados",
        "Predicción y modelado",
        "Visualización de datos",
      ],
    },
    {
      titulo: "Ciberseguridad",
      descripcion: "Protegemos tu negocio con soluciones de seguridad avanzadas contra amenazas digitales.",
      icono: <Shield className="w-16 h-16 text-amber-400" />,
      detalles: [
        "Auditorías de seguridad",
        "Protección contra malware",
        "Gestión de vulnerabilidades",
        "Formación en seguridad",
      ],
    },
    {
      titulo: "Bases de Datos",
      descripcion: "Diseñamos e implementamos soluciones de bases de datos escalables y eficientes para tu negocio.",
      icono: <Database className="w-16 h-16 text-amber-400" />,
      detalles: ["Diseño de esquemas", "Optimización de consultas", "Migración de datos", "Soluciones NoSQL y SQL"],
    },
    {
      titulo: "Marketing Digital",
      descripcion: "Estrategias de marketing digital que aumentan tu visibilidad online y generan conversiones.",
      icono: <Globe className="w-16 h-16 text-amber-400" />,
      detalles: ["SEO y SEM", "Marketing de contenidos", "Redes sociales", "Email marketing"],
    },
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

      {/* Contenido principal */}
      <div className="flex flex-col gap-y-8 justify-center items-center relative z-10 min-h-screen px-4 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg text-center">
          Nuestros Servicios
        </h1>
        <p className="text-white text-xl md:text-2xl max-w-[80%] text-center drop-shadow-sm mb-8">
          Ofrecemos soluciones tecnológicas integrales adaptadas a las necesidades específicas de tu negocio.
        </p>

        {/* Servicios grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {servicios.map((servicio, index) => (
            <div
              key={index}
              className={`bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 flex flex-col items-center ${
                activeService === index
                  ? "ring-2 ring-amber-400 transform scale-105"
                  : "hover:transform hover:scale-105"
              }`}
              onClick={() => setActiveService(index)}
            >
              <div className="mb-4">{servicio.icono}</div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">{servicio.titulo}</h3>
              <p className="text-gray-300 text-center">{servicio.descripcion}</p>
            </div>
          ))}
        </div>

        {/* Detalles del servicio seleccionado */}
        <div className="mt-12 w-full max-w-4xl">
          <div className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="md:w-1/4 flex justify-center">{servicios[activeService].icono}</div>
              <div className="md:w-3/4">
                <h2 className="text-3xl font-bold text-white mb-4">{servicios[activeService].titulo}</h2>
                <p className="text-gray-300 mb-6">{servicios[activeService].descripcion}</p>
                <h4 className="text-xl font-semibold text-amber-400 mb-3">Características:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {servicios[activeService].detalles.map((detalle, index) => (
                    <li key={index} className="text-white flex items-center">
                      <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                      {detalle}
                    </li>
                  ))}
                </ul>
                <button className="mt-8 bg-white text-gray-800 font-bold px-6 py-3 rounded-full shadow-md hover:bg-amber-400 hover:text-white transition-colors duration-300">
                  Solicitar este servicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

