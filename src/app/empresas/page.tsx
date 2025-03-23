"use client"

import Link from "next/link"
import { Construction } from "lucide-react"
import MenuButton from "@/components/ui/MenuButton"
import OverlayMenu from "@/components/ui/OverlayMenu"

export default function Empresas() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
      <MenuButton/>
      <OverlayMenu/>

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

