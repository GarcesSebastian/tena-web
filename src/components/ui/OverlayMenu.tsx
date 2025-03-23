"use client"

import { FC } from "react"
import Link from "next/link"
import { useUserData } from "@/hooks/useUserData"

const menuOptions = [
  { label: "Inicio", href: "/" },
  { label: "Empresas", href: "/empresas" },
  { label: "Servicios", href: "/servicios" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
  { label: "Mensajes", href: "/mensajes" },
]

const OverlayMenu: FC = () => {
  const { user, setUser } = useUserData()

  const toggleNav = () => {
    setUser({
      ...user,
      states: {
        ...user.states,
        isNav: !user.states.isNav,
      },
    })
  }
  
  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-700 ${
        user.states.isNav ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`absolute bg-black rounded-full transition-all duration-700 ${
          user.states.isNav ? "w-[4000px] h-[4000px]" : "w-0 h-0"
        }`}
      ></div>

      <nav
        className={`relative z-50 flex flex-col gap-6 text-center transition-opacity duration-700 ${
          user.states.isNav ? "opacity-100" : "opacity-0"
        }`}
      >
        {menuOptions.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="text-white text-2xl block hover:text-amber-400 hover:scale-105 transform transition-all duration-300 ease-in-out"
            onClick={toggleNav}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default OverlayMenu
