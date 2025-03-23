"use client"

import { useEffect } from "react";
import Image from "next/image"
import MenuButton from "@/components/ui/MenuButton"
import OverlayMenu from "@/components/ui/OverlayMenu"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Home() {
  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Coordenadas:", position.coords.latitude, position.coords.longitude);
          
          fetch(`${API_URL}/user/save-precise-location`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            }),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
          })
          .then(data => {
            console.log("Datos guardados:", data);
          })
          .catch(err => {
            console.error("Error al enviar ubicación al servidor:", err);
          });
        },
        (error) => {
          console.error('Error obteniendo la geolocalización:', error);
        },
        options
      );
    } else {
      console.error('Geolocalización no soportada en este navegador');
    }
  }, []);
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
      <MenuButton/>
      <OverlayMenu/>

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image
          src="/fondo.jpg"
          alt="Imagen de fondo"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col gap-y-5 justify-center items-center relative z-10 h-full px-4 text-center">
        <h1 className="text-5xl max-sm:text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Bienvenidos al Sitio Web
        </h1>
        <p className="text-white text-xl md:text-2xl max-w-[70%] max-sm:max-w-[90%] max-sm:text-lg drop-shadow-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias a commodi reprehenderit quia voluptatem laudantium error vitae nam harum, consequuntur hic dolorem, iure eius. Optio porro consectetur debitis neque officia!
        </p>
        <button className="bg-white text-gray-800 font-bold px-6 py-3 rounded-full shadow-md hover:bg-amber-400 hover:text-white transition-colors duration-300 mt-6">
          Leer más...
        </button>
      </div>
    </div>
  )
}