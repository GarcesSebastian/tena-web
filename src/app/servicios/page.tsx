"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Loader, Plus, Trash2, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import MenuButton from "@/components/ui/MenuButton"
import OverlayMenu from "@/components/ui/OverlayMenu"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Servicios() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    serviceId: null,
    serviceName: ""
  })
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: ""
  })
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    imagen_base64: ""
  })
  
  const defaultServices = [
    {
      id: -1,
      titulo: "Desarrollo Web",
      descripcion: "Creamos sitios web modernos, responsivos y optimizados para buscadores",
      imagen: "/imagen1.jpg",
    },
    {
      id: -2,
      titulo: "Aplicaciones Móviles",
      descripcion: "Soluciones nativas e híbridas para iOS y Android",
      imagen: "/imagen2.jpg",
    },
    {
      id: -3,
      titulo: "Consultoría IT",
      descripcion: "Asesoramiento estratégico para optimizar tu infraestructura tecnológica",
      imagen: "/imagen3.jpg",
    }
  ]

  const showNotification = (type, message, duration = 3000) => {
    setNotification({
      show: true,
      type,
      message
    })

    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }))
    }, duration)
  }

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`${API_URL}/services/get`)
        
        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        const customServices = data.map(service => ({
          ...service,
          imagen: service.imagen_base64 || "/placeholder.svg",
          isCustom: true
        }))

        const uniqueDefaultServices = defaultServices.map(service => ({
          ...service,
          isCustom: false
        }))

        setServices([...uniqueDefaultServices, ...customServices])
        showNotification("success", "Servicios cargados correctamente")
      } catch (error) {
        console.error("Error al obtener servicios:", error)
        setError("No se pudieron cargar todos los servicios. Mostrando servicios predeterminados.")
        showNotification("error", "Error al cargar servicios. Mostrando servicios predeterminados.")
        
        setServices(defaultServices.map(service => ({
          ...service,
          isCustom: false
        })))
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData({ ...formData, imagen_base64: reader.result });
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.titulo || !formData.descripcion || !formData.imagen_base64) {
      showNotification("warning", "Todos los campos son obligatorios")
      return
    }
    
    try {
      setFormLoading(true)
      
      const response = await fetch(`${API_URL}/services/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`)
      }
      
      const responseData = await response.json()
      
      const newId = responseData.servicio?.id || `temp-${Date.now()}`
      
      const newService = {
        id: newId,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        imagen: formData.imagen_base64,
        imagen_base64: formData.imagen_base64,
        isCustom: true
      }
      
      setServices(prevServices => [...prevServices, newService])
      setFormData({
        titulo: "",
        descripcion: "",
        imagen_base64: ""
      })
      setShowForm(false)
      
      showNotification("success", "Servicio creado correctamente")
      
    } catch (error) {
      console.error("Error al crear servicio:", error)
      showNotification("error", "Error al crear el servicio. Inténtalo de nuevo.")
    } finally {
      setFormLoading(false)
    }
  }

  const confirmDelete = (id) => {
    const serviceToDelete = services.find(service => service.id === id)
    
    if (!serviceToDelete) {
      console.error("No se encontró el servicio a eliminar")
      return
    }
    
    if (id < 0 || serviceToDelete.isCustom === false) {
      showNotification("warning", "No se puede eliminar un servicio predeterminado")
      return
    }

    setConfirmDialog({
      show: true,
      serviceId: id,
      serviceName: serviceToDelete.titulo
    })
  }

  const handleDeleteService = async (id) => {
    try {
      setDeleteLoading(id)
      
      setServices(prevServices => prevServices.filter(service => service.id !== id))
      
      if (typeof id === 'string' && id.startsWith('temp-')) {
        console.log("Servicio temporal eliminado")
        showNotification("success", "Servicio eliminado correctamente")
        return
      }
      
      const response = await fetch(`${API_URL}/services/delete/${id}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`)
      }
      
      showNotification("success", "Servicio eliminado correctamente")
      console.log("Servicio eliminado exitosamente")
      
      if (selectedImage !== null) {
        setSelectedImage(null)
      }
      
    } catch (error) {
      console.error("Error al eliminar servicio:", error)
      showNotification("error", "Error al eliminar el servicio. Inténtalo de nuevo.")
      
      const serviceToDelete = services.find(service => service.id === id)
      if (serviceToDelete) {
        setServices(prevServices => [...prevServices, serviceToDelete])
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
      <MenuButton/>
      <OverlayMenu/>

      <div className="flex flex-col gap-y-8 justify-center items-center relative z-10 min-h-screen px-4 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg text-center">
          Nuestros Servicios
        </h1>
        <p className="text-white text-xl md:text-2xl max-w-[80%] text-center drop-shadow-sm mb-4">
          Nuestros servicios están diseñados para satisfacer las necesidades de tu empresa
        </p>

        <button 
          onClick={() => setShowForm(true)}
          className="mb-8 flex items-center gap-2 bg-amber-400 text-gray-900 px-6 py-3 rounded-full font-bold shadow-md hover:bg-amber-500 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Crear nuevo servicio
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-12 h-12 text-amber-400 animate-spin mb-4" />
            <p className="text-white text-lg">Cargando servicios...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="w-full max-w-7xl bg-red-500/20 border border-red-600 rounded-lg p-4 mb-6">
                <p className="text-white text-center">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
              {services.map((item, index) => (
                <div
                  key={`service-${item.id}`}
                  className="group relative overflow-hidden rounded-xl shadow-lg"
                >
                  <div 
                    className="relative h-64 w-full cursor-pointer"
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image 
                      src={item.imagen || item.imagen_base64 || "/placeholder.svg"} 
                      alt={item.titulo} 
                      fill 
                      className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-amber-400 transition-colors duration-300">
                        {item.titulo}
                      </h3>
                      <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.descripcion}
                      </p>
                    </div>
                  </div>
                  
                  {item.isCustom && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(item.id);
                      }}
                      className="absolute top-2 right-2 z-10 bg-red-500/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300"
                      title="Eliminar servicio"
                      disabled={deleteLoading === item.id}
                    >
                      {deleteLoading === item.id ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedImage !== null && services[selectedImage] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] pt-6 bg-gray-900 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-amber-400 hover:text-gray-900 transition-colors duration-300"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>

            {services[selectedImage].isCustom && (
              <button
                className="absolute top-4 left-4 z-10 bg-red-500/70 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                onClick={() => {
                  confirmDelete(services[selectedImage].id);
                }}
                title="Eliminar servicio"
                disabled={deleteLoading === services[selectedImage].id}
              >
                {deleteLoading === services[selectedImage].id ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            )}

            <div className="relative h-[50vh] w-full">
              <Image
                src={services[selectedImage].imagen || services[selectedImage].imagen_base64 || "/placeholder.svg"}
                alt={services[selectedImage].titulo}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-6 bg-gray-900">
              <h2 className="text-2xl font-bold text-white mb-2">{services[selectedImage].titulo}</h2>
              <p className="text-gray-300 mb-4">{services[selectedImage].descripcion}</p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-gray-900 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-amber-400 hover:text-gray-900 transition-colors duration-300"
              onClick={() => setShowForm(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Crear nuevo servicio</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="titulo"
                    className="block mb-2 text-sm font-medium text-gray-300"
                  >
                    Título
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-gray-700 focus:border-amber-400 border focus:outline-none focus:ring-1 transition-colors"
                    placeholder="Título del servicio"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="descripcion"
                    className="block mb-2 text-sm font-medium text-gray-300"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-gray-700 focus:border-amber-400 border focus:outline-none focus:ring-1 transition-colors min-h-[100px] max-h-[200px]"
                    placeholder="Descripción del servicio..."
                    required
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="imagen"
                    className="block mb-2 text-sm font-medium text-gray-300"
                  >
                    Imagen
                  </label>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-gray-700 focus:border-amber-400 border focus:outline-none focus:ring-1 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-400 file:text-gray-900 hover:file:bg-amber-500"
                    required
                  />
                </div>
                {formData.imagen_base64 && (
                  <div className="mt-2">
                    <p className="text-gray-300 mb-2 text-sm">Vista previa:</p>
                    <div className="relative h-40 w-full rounded-lg overflow-hidden">
                      <Image 
                        src={formData.imagen_base64} 
                        alt="Vista previa" 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`w-full px-6 py-3 rounded-full font-bold shadow-md transition-colors duration-300 ${
                    formLoading 
                    ? "bg-gray-600 cursor-not-allowed" 
                    : "bg-amber-400 text-gray-900 hover:bg-amber-500"
                  }`}
                >
                  {formLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Creando...
                    </span>
                  ) : "Crear servicio"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {notification.show && (
        <div className="fixed top-4 right-4 max-w-full z-50 animate-slideIn">
          <div className={`flex items-center p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-emerald-500" : 
            notification.type === "error" ? "bg-red-500" : 
            notification.type === "warning" ? "bg-amber-500" : "bg-blue-500"
          }`}>
            {notification.type === "success" && <CheckCircle className="w-6 h-6 text-white mr-3" />}
            {notification.type === "error" && <AlertCircle className="w-6 h-6 text-white mr-3" />}
            {notification.type === "warning" && <AlertTriangle className="w-6 h-6 text-white mr-3" />}
            <p className="text-white font-medium">{notification.message}</p>
            <button 
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="ml-4 text-white/80 hover:text-white focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {confirmDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-xl">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 rounded-full bg-red-500/20 text-red-500">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-xl text-white font-bold text-center mb-2">Confirmar eliminación</h3>
            <p className="text-gray-300 text-center mb-6">
              ¿Estás seguro de que deseas eliminar el servicio <span className="font-bold text-amber-400">{confirmDialog.serviceName}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmDialog({ show: false, serviceId: null, serviceName: "" })}
                className="flex-1 py-3 px-4 rounded-lg font-medium border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const { serviceId } = confirmDialog
                  setConfirmDialog({ show: false, serviceId: null, serviceName: "" })
                  handleDeleteService(serviceId)
                }}
                className="flex-1 py-3 px-4 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}