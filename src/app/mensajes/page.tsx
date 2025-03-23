"use client"

import { useEffect, useState } from "react"
import { Search, ChevronDown, ChevronUp, Trash2, Eye, Calendar, Mail, User, Loader } from "lucide-react"
import MenuButton from "@/components/ui/MenuButton"
import OverlayMenu from "@/components/ui/OverlayMenu"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Mensajes() {
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
      setError(null)
      const response = await fetch(`${API_URL}/forms/get`)
      
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setMensajes(data)
    } catch (error) {
      console.error("Error al obtener mensajes:", error)
      setError(error.message || "Error al cargar los mensajes")
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    fetchMensajes()
  }, [])

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

  const handleDeleteMessage = async (id) => {
    if (actionLoading) return
    
    try {
      setActionLoading(true)
      const response = await fetch(`${API_URL}/forms/delete/${id}`, {
        method: "DELETE"
      })
      
      if (!response.ok) throw new Error("Error al eliminar el mensaje")
      
      setMensajes(prevMensajes => prevMensajes.filter(mensaje => mensaje.id !== id))
      
      showNotification(true, "Mensaje eliminado correctamente")
      
      if (selectedMessage === id) {
        setSelectedMessage(null)
      }
    } catch (error) {
      showNotification(false, error.message || "Error al eliminar el mensaje")
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleRead = async (id, currentStatus) => {
    if (actionLoading) return
    
    try {
      setActionLoading(true)
      const response = await fetch(`${API_URL}/forms/update/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leido: !currentStatus })
      })
      
      if (!response.ok) throw new Error(`Error al marcar mensaje como ${currentStatus ? 'no leído' : 'leído'}`)
      
      const updatedData = await response.json()
      
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

  const filteredMensajes = sortedMensajes.filter(
    (mensaje) =>
      mensaje.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mensaje.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mensaje.mensaje.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const selectedMessageData = selectedMessage ? mensajes.find(m => m.id === selectedMessage) : null

  const handleRetry = () => {
    fetchMensajes()
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
      <MenuButton/>
      <OverlayMenu/>

      <div className="flex flex-col gap-y-8 relative z-10 min-h-screen px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center max-sm:text-3xl max-[320px]:text-2xl">
          Mensajes Recibidos
        </h1>
        <p className="text-white text-lg md:text-xl max-w-[80%] max-sm:max-w-full mx-auto text-center drop-shadow-sm mb-4">
          Gestiona los mensajes enviados a través del formulario de contacto
        </p>

        <div className="w-full max-w-[1480px] mx-auto mb-6">
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

        {
          initialLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-12 h-12 text-amber-400 animate-spin mb-4" />
              <p className="text-white text-lg">Cargando mensajes...</p>
            </div>
          ) : error ? (
            <div className="w-full max-w-[1480px] mx-auto">
              <div className="bg-red-500/20 border border-red-600 rounded-lg p-6 text-center">
                <p className="text-white text-lg mb-4">Error: {error}</p>
                <button 
                  onClick={handleRetry} 
                  className="px-4 py-2 bg-amber-500 text-gray-900 font-medium rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[1480px] mx-auto bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
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

              {filteredMensajes.length === 0 && !error && !initialLoading && (
                <div className="text-center py-10">
                  <p className="text-gray-400">No se encontraron mensajes</p>
                </div>
              )}
            </div>
          )
        }

      </div>

      {selectedMessage !== null && selectedMessageData && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-gray-900 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Detalles del mensaje</h2>

              {actionLoading && (
                <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center z-10">
                  <Loader className="w-10 h-10 text-amber-400 animate-spin" />
                </div>
              )}

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
                <textarea className="text-white w-full bg-transparent outline-none min-h-[100px] max-h-[200px]" readOnly>{selectedMessageData.mensaje}</textarea>
              </div>

              <div className="flex justify-end gap-3 max-sm:flex-col-reverse">
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

      {notification.show && (
        <div 
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            notification.success ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </div>
      )}
    </div>
  )
}