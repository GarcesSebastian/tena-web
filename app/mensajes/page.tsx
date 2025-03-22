"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, ChevronDown, ChevronUp, Trash2, Eye, Calendar, Mail, User } from "lucide-react"

export default function Mensajes() {
  const [navOpen, setNavOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("fecha")
  const [sortDirection, setSortDirection] = useState("desc")
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [mensajes, setMensajes] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState({ show: false, success: false, message: "" })

  const fetchMensajes = async () => {
    try {
      setInitialLoading(true)
      const response = await fetch("http://localhost:4000/forms/get")
      if (!response.ok) throw new Error("Error al obtener los mensajes")
      const data = await response.json()
      setMensajes(data)
      setError(null)
    } catch (error) {
      setError(error.message || "Error al cargar los mensajes")
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    fetchMensajes()
  }, [])

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

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Mostrar notificación
  const showNotification = (success, message) => {
    setNotification({
      show: true,
      success,
      message
    })
    
    setTimeout(() => {
      setNotification({ show: false, success: false, message: "" })
    }, 4000)
  }

  // Función para eliminar mensaje
  const handleDeleteMessage = async (id) => {
    if (actionLoading) return
    
    try {
      setActionLoading(true)
      const response = await fetch(`http://localhost:4000/forms/delete/${id}`, {
        method: "DELETE"
      })
      
      if (!response.ok) throw new Error("Error al eliminar el mensaje")
      
      // Actualizar el estado local sin necesidad de recargar todos los mensajes
      setMensajes(prevMensajes => prevMensajes.filter(mensaje => mensaje.id !== id))
      
      showNotification(true, "Mensaje eliminado correctamente")
      
      // Si el mensaje que se está visualizando es el que se eliminó, cerrar el modal
      if (selectedMessage === id) {
        setSelectedMessage(null)
      }
    } catch (error) {
      showNotification(false, error.message || "Error al eliminar el mensaje")
    } finally {
      setActionLoading(false)
    }
  }

  // Función para marcar mensaje como leído/no leído
  const handleToggleRead = async (id, currentStatus) => {
    if (actionLoading) return
    
    try {
      setActionLoading(true)
      const response = await fetch(`http://localhost:4000/forms/update/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leido: !currentStatus })
      })
      
      if (!response.ok) throw new Error(`Error al marcar mensaje como ${currentStatus ? 'no leído' : 'leído'}`)
      
      const updatedData = await response.json()
      
      // Actualizar el estado local sin necesidad de recargar todos los mensajes
      setMensajes(prevMensajes => 
        prevMensajes.map(mensaje => 
          mensaje.id === id ? { ...mensaje, leido: !currentStatus } : mensaje
        )
      )
      
      showNotification(true, `Mensaje marcado como ${currentStatus ? 'no leído' : 'leído'}`)
    } catch (error) {
      showNotification(false, error.message || `Error al actualizar el estado del mensaje`)
    } finally {
      setActionLoading(false)
    }
  }

  // Función para ordenar los mensajes
  const sortedMensajes = [...mensajes].sort((a, b) => {
    if (sortField === "fecha") {
      return sortDirection === "asc"
        ? new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        : new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    } else if (sortField === "nombre") {
      return sortDirection === "asc" ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
    } else if (sortField === "leido") {
      return sortDirection === "asc" ? (a.leido ? 1 : 0) - (b.leido ? 1 : 0) : (b.leido ? 1 : 0) - (a.leido ? 1 : 0)
    }
    return 0
  })

  // Filtrar mensajes por término de búsqueda
  const filteredMensajes = sortedMensajes.filter(
    (mensaje) =>
      mensaje.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mensaje.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mensaje.mensaje.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Función para cambiar el orden
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Obtener el mensaje seleccionado
  const selectedMessageData = selectedMessage ? mensajes.find(m => m.id === selectedMessage) : null

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

      {/* Contenido principal - Tabla de mensajes */}
      <div className="flex flex-col gap-y-8 relative z-10 min-h-screen px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center">
          Mensajes Recibidos
        </h1>
        <p className="text-white text-lg md:text-xl max-w-[80%] mx-auto text-center drop-shadow-sm mb-4">
          Gestiona los mensajes enviados a través del formulario de contacto
        </p>

        {/* Barra de búsqueda */}
        <div className="w-full max-w-5xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar mensajes..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-amber-400 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Notificación de acciones */}
        {notification.show && (
          <div 
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notification.success ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {notification.message}
          </div>
        )}

        {
          initialLoading ? (
            <p className="text-white text-center">Cargando datos...</p>
          ) : error ? (
            <p className="text-red-500 text-center">Error: {error}</p>
          ) : (
            <div className="w-full max-w-5xl mx-auto bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <button className="flex items-center focus:outline-none" onClick={() => handleSort("leido")}>
                          Estado
                          {sortField === "leido" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 w-4 h-4" />
                            ) : (
                              <ChevronDown className="ml-1 w-4 h-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <button className="flex items-center focus:outline-none" onClick={() => handleSort("nombre")}>
                          Remitente
                          {sortField === "nombre" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 w-4 h-4" />
                            ) : (
                              <ChevronDown className="ml-1 w-4 h-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                        Mensaje
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <button className="flex items-center focus:outline-none" onClick={() => handleSort("fecha")}>
                          Fecha
                          {sortField === "fecha" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 w-4 h-4" />
                            ) : (
                              <ChevronDown className="ml-1 w-4 h-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredMensajes.map((mensaje) => (
                      <tr
                        key={mensaje.id}
                        className={`hover:bg-gray-800 transition-colors duration-200 ${mensaje.leido ? "" : "bg-gray-800/50"}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              mensaje.leido ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {mensaje.leido ? "Leído" : "No leído"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-white font-medium">{mensaje.nombre}</span>
                            <span className="text-gray-400 text-sm">{mensaje.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <p className="text-gray-300 truncate max-w-xs whitespace-nowrap">{mensaje.mensaje}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatDate(mensaje.fecha)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedMessage(mensaje.id)}
                            className="text-amber-400 hover:text-amber-300 mr-3"
                            title="Ver mensaje"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            className={`text-red-400 hover:text-red-300 ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleDeleteMessage(mensaje.id)}
                            disabled={actionLoading}
                            title="Eliminar mensaje"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredMensajes.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-400">No se encontraron mensajes</p>
                </div>
              )}
            </div>
          )
        }

      </div>

      {/* Modal para ver mensaje completo */}
      {selectedMessage !== null && selectedMessageData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-gray-900 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Detalles del mensaje</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Remitente</p>
                    <p className="text-white">{selectedMessageData.nombre}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{selectedMessageData.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Fecha</p>
                    <p className="text-white">{formatDate(selectedMessageData.fecha)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg mb-6 overflow-x-auto">
                <p className="text-gray-400 text-sm mb-2">Mensaje</p>
                <p className="text-white">{selectedMessageData.mensaje}</p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  onClick={() => setSelectedMessage(null)}
                >
                  Cerrar
                </button>
                <button 
                  className={`px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-400 transition-colors ${
                    actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleDeleteMessage(selectedMessageData.id)}
                  disabled={actionLoading}
                >
                  Eliminar mensaje
                </button>
                <button 
                  className={`px-4 py-2 bg-amber-500 text-gray-900 font-medium rounded-lg hover:bg-amber-400 transition-colors ${
                    actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleToggleRead(selectedMessageData.id, selectedMessageData.leido)}
                  disabled={actionLoading}
                >
                  Marcar como {selectedMessageData.leido ? "no leído" : "leído"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}