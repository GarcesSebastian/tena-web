"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"

export default function Contacto() {
  const [navOpen, setNavOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [formData, setFormData] = useState({ nombre: "", email: "", mensaje: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // "success" or "error"

  const options = [
    { label: "Inicio", href: "/" },
    { label: "Empresas", href: "/empresas" },
    { label: "Servicios", href: "/servicios" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
    { label: "Mensajes", href: "/mensajes" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setMessageType("")

    const payload = {
      ...formData,
      fecha: new Date().toISOString().replace("T", " ").slice(0, 19),
      leido: false
    }

    try {
      const response = await fetch("http://localhost:4000/forms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error("Error al enviar el formulario")
      
      setMessage("Mensaje enviado correctamente")
      setMessageType("success")
      setFormData({ nombre: "", email: "", mensaje: "" }) // Reset form
    } catch (error) {
      setMessage("Error al enviar el mensaje. Inténtalo de nuevo.")
      setMessageType("error")
    } finally {
      setLoading(false)
      // Message will automatically disappear after 5 seconds
      setTimeout(() => {
        setMessage("")
        setMessageType("")
      }, 5000)
    }
  }

  const handleOptionClick = () => {
    setNavOpen(false)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <div
      className={`relative w-full min-h-screen overflow-hidden ${isDarkMode ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-100 to-white"}`}
    >
      <button
        onClick={() => setNavOpen(!navOpen)}
        className="absolute top-4 left-4 z-50 p-2 focus:outline-none cursor-pointer rounded-md hover:bg-gray-600 transition-colors duration-300"
      >
        <div className="w-8 h-8 relative">
          <span
            className={`block absolute h-0.5 w-full ${isDarkMode ? "bg-white" : "bg-gray-800"} transform transition duration-300 ease-in-out ${
              navOpen ? "rotate-45 top-3" : "top-1"
            }`}
          ></span>
          <span
            className={`block absolute h-0.5 w-full ${isDarkMode ? "bg-white" : "bg-gray-800"} transform transition duration-300 ease-in-out ${
              navOpen ? "opacity-0" : "top-3"
            }`}
          ></span>
          <span
            className={`block absolute h-0.5 w-full ${isDarkMode ? "bg-white" : "bg-gray-800"} transform transition duration-300 ease-in-out ${
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

      {/* Contenido principal - Card de contacto */}
      <div className="flex justify-center items-center min-h-screen px-4 py-8">
        <div
          className={`w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? "bg-gray-900" : "bg-white"} transition-colors duration-300`}
        >
          {/* Toggle de tema - Visible en todas las resoluciones */}
          <div className="w-full p-4 flex justify-end">
            <div className="flex items-center gap-3">
              <Moon className={`w-5 h-5 ${isDarkMode ? "text-amber-400" : "text-gray-400"}`} />
              <div
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
                  isDarkMode ? "bg-gray-700" : "bg-blue-200"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${
                    isDarkMode ? "bg-gray-300 left-1" : "bg-white left-7"
                  }`}
                ></div>
              </div>
              <Sun className={`w-5 h-5 ${!isDarkMode ? "text-amber-400" : "text-gray-400"}`} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Lado izquierdo - Luna/Sol en desktop */}
            <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col items-center justify-center">
              {/* Círculo con efecto luna/sol */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div
                  className={`absolute w-48 h-48 rounded-full transition-all duration-500 ${isDarkMode ? "bg-white" : "bg-gray-800"}`}
                ></div>
                <div
                  className={`absolute w-40 h-40 rounded-full transition-all duration-500 transform ${
                    isDarkMode ? "bg-gray-900 translate-x-6" : "bg-blue-100 translate-x-0"
                  }`}
                ></div>
              </div>
            </div>

            {/* Lado derecho - Formulario */}
            <div className="w-full md:w-2/3 p-6 md:p-8">
              <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Contactar</h2>
              
              {/* Mensaje de éxito o error */}
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  messageType === "success" 
                    ? (isDarkMode ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800") 
                    : (isDarkMode ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800")
                }`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="nombre"
                    className={`block mb-2 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 text-white border-gray-700 focus:border-amber-400"
                        : "bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500"
                    } border focus:outline-none focus:ring-1 transition-colors`}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className={`block mb-2 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 text-white border-gray-700 focus:border-amber-400"
                        : "bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500"
                    } border focus:outline-none focus:ring-1 transition-colors`}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="mensaje"
                    className={`block mb-2 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 text-white border-gray-700 focus:border-amber-400"
                        : "bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500"
                    } border focus:outline-none focus:ring-1 transition-colors`}
                    placeholder="Tu mensaje..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full md:w-auto px-6 py-3 rounded-full font-bold shadow-md transition-colors duration-300 ${
                    isDarkMode
                      ? (loading ? "bg-gray-600 cursor-not-allowed" : "bg-amber-400 text-gray-900 hover:bg-amber-500")
                      : (loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700")
                  }`}
                >
                  {loading ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}